'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Discount'
const DOCUMENT_NAME = 'Discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        default: 'fixed_amount'
    },
    discount_value: {
        type: Number,
        required: true
    },
    discount_code: {
        type: String,
        required: true
    },
    discount_start_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_max_uses: { // so luong discount duoc ap dung
        type: Number,
        required: true
    },
    discount_uses_count: { // so discount da su dung
        type: Number,
        required: true
    },
    discount_users_used: { // danh sach user su dung discount
        type: Array,
        default: []
    },
    discount_max_uses_per_user: { // so luong discount toi da cho phep duoc su dung voi moi user
        type: Number,
        required: true
    },
    discount_min_order_value: {
        type: Number,
        required: true
    },
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ['all', 'specific']
    },
    discount_product_ids: { // so san pham duoc ap dung
        type: Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
