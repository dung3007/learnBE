'use strict';

const { Schema, model } = require("mongoose");

const DOCUMNET_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending']
    },
    cart_products: {
        type: Array,
        required: true,
        default: []
    },
    cart_count_product: {
        type: Number,
        default: 0
    },
    cart_userId: {
        type: Number,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
})

module.exports = model(DOCUMNET_NAME, cartSchema)