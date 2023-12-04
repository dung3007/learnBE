'use strict';

const redis = require('redis');
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000 // 3s tam lock

    for (let i = 0; i < retryTimes.length; i++) {
        // tao 1 key, thang nao giu thi duoc vao thanh toan
        const result = await setnxAsync(key, expireTime)
        if (result === 1) { // = 1 la co nguoi dang giu key, = 0 la chua co ai giu key
            // thao tac voi inventory
            const isReversation = await reservationInventory({
                productId, quantity, cartId
            })
            if(isReversation.modifiedCount) {
                await pexpire(key, expireTime)
                return key;
            }

            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const deleteAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await deleteAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}