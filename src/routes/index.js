'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey)

// check permission
router.use(permission('0000'))

router.use('/v1/api/checkout', require('../routes/checkout/index'))
router.use('/v1/api/discount', require('../routes/discount/index'))
router.use('/v1/api/inventory', require('../routes/inventory/index'))
router.use('/v1/api/cart', require('../routes/cart/index'))
router.use('/v1/api/product', require('../routes/product/index'))
router.use('/v1/api', require('../routes/access/index'))

module.exports = router