
const _ = require('lodash')
const { Types } = require('mongoose')

const getInforData = ({ fields = [], object = {}}) => {
    return _.pick( object, fields )
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[key] == null) {
            delete obj[key]
        }
    })
}

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj || {}).forEach(k => {
        if (typeof obj[k] === 'Object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response || {}).forEach(a => {
                final[`${k}.${a}`] = response[a]
            })
        } else {
            final[k] = obj[k]
        }
    })

    return final;
}

const convertToObjectMongodb = id => new Types.ObjectId(id)

module.exports = {
    getInforData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectMongodb
}