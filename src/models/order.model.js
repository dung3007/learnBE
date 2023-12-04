'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Order'
const DOCUMENT_NAME = 'Orders'

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    order_userId: {
        type: Number,
        required: true
    },
    /*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
    order_checkout: {
        type: Object,
        default: {}
    },
    /*
        {
            street,
            city,
            state,
            country
        }
    */
    order_shipping: {
        type: Object,
        default: {}
    },
    order_payment: {
        type: Object,
        default: {}
    },
    order_products: {
        type: Array,
        required: true
    },
    order_trackingNumber: {
        type: String,
        default: '#000003223'
    },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
        default: 'pending'
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
});

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
