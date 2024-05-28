const {selectTopics} = require('../models/api-topics.model')
const endpoints = require('../../endpoints.json')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getApis = (req, res, next) => {
    res.status(200).send({ endpoints })
}