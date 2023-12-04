const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();
require('dotenv').config();


// init middleware
app.use(morgan('dev')) // ghi log
app.use(helmet()) //
app.use(compression()) // giảm dung lượng data vận chuyển
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
// init db

require('./src/dbs/init.mongodb')
const { checkOverload } = require('./src/helpers/check.connect');
// checkOverload()
// init routes
app.use('/', require('./src/routes'))

// handle error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app