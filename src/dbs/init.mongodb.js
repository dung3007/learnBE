'use strict'

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

const connectString = process.env.MONGODB_URL

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        // if (1 == 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        // }
        mongoose.connect(process.env.MONGODB_URL, { maxPoolSize: 50 }).then(() => console.log('Connect DB Success', countConnect()))
            .catch(err => console.log('Error Connect', err))
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb