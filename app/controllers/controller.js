const {selectTopics} = require('../models/api-topics.model')
const {selectArticleById, selectArticles} = require('../models/api-articles.model')
const endpoints = require('../../endpoints.json')
const { doesArticleExist, selectComments, insertComment } = require('../models/api-comments.model')

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
    res.status(200).send({article})
})
.catch((err) => {
    next(err)
})
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getComments = (req, res, next) => {
    const {article_id} = req.params
    if (isNaN(article_id) || !Number.isInteger(Number(article_id)) || Number(article_id) <= 0) {
        return next({ status: 400, message: 'Bad Request: Invalid article id' });
    }
    doesArticleExist(article_id)
    .then((data) => {
        return selectComments(data)
    })
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.addComment = (req, res, next) => {
    const {article_id} = req.params
    if (isNaN(article_id) || !Number.isInteger(Number(article_id)) || Number(article_id) <= 0) {
        return next({ status: 400, message: 'Bad Request: Invalid article id' });
    }
    doesArticleExist(article_id)
    .then(() => {
        return insertComment(req.body, article_id)
    })
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}