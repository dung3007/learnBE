'use strict'

const { convertToObjectMongodb } = require("../../utils")
const cartModel = require("../cart.model")

const findCartById = async (cartId) => {
    return await cartModel.findOne({_id: convertToObjectMongodb(cartId), cart_state: 'active'}).lean()
}

module.exports = {
    findCartById
}