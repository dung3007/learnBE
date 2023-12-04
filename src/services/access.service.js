'use strict'

const crypto = require('crypto')
const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInforData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    /**
     * check this token used?
     * 
     */
    static handlerRefreshTokenV2 = async ({refreshToken, user, keyStore}) => {
        const { userId, email } = user;
        if (keyStore.refreshTokenUsed?.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened! Pls relogin!')
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Shop not registered!')
        }

        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registered!')

        // create 1 cặp token mới
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        // update token
        await keyStore.updateOne ({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }
    }

    static handlerRefreshToken = async (refreshToken) => {
        // check token đã được sử dụng chưa
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        // Nếu có thì xóa tất cả token trong keyStore
        if(foundToken) {
            const { userId, email } = verifyJWT(refreshToken, foundToken.privateKey)

            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened! Pls relogin!')
        }

        // Nếu không có
        const holderToken = KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken) throw new AuthFailureError('Shop not registered!')

        // verify token
        const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey)

        // check userId
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registered!')

        // create 1 cặp token mới
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        // update token
        await holderToken.update({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user: { userId, email},
            tokens
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }

    /**
        1- Check email in dbs
        2- match password
        3- create access token, refresh token
        4- generate tokens
        5- get data return login
     */
    static login = async ({ email, password, refreshToken = null }) => {

        //1
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not registered!')

        //2
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')

        //3
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        //4
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId: userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: userId
        })

        return {
            shop: getInforData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static signup = async ({ name, email, password }) => {
        // try {

        // Step 1: Check email exist
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {

            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keyStore error!'
                }
            }

            //created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            return {
                code: 201,
                metadata: {
                    shop: getInforData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService