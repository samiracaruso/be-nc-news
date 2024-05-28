const {selectTopics} = require('../models/api-topics.model')
const {selectArticleById} = require('../models/api-articles.model')
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

exports.getArticleById = (req, res, next) => {

const {article_id} = req.params

if (isNaN(article_id) || !Number.isInteger(Number(article_id)) || Number(article_id) <= 0) {
    return next({ status: 400, message: 'Bad Request: Invalid article id' });
}

selectArticleById(article_id)
.then((article) => {
    console.log(article)
    res.status(200).send({article})
})
.catch((err) => {
    next(err)
})
}