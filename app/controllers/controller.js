const {selectTopics} = require('../models/api-topics.model')
const {selectArticleById, selectArticles, patchArticleById} = require('../models/api-articles.model')
const endpoints = require('../../endpoints.json')
const { doesArticleExist, selectComments, insertComment, doesUsernameExist, removeComment } = require('../models/api-comments.model')

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

isArticleIdValid = (article_id) => {
    if (isNaN(article_id) || !Number.isInteger(Number(article_id)) || Number(article_id) <= 0) {
        return next({ status: 400, message: 'Bad Request: Invalid article id' });
    }
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
    const {username, body} = req.body
    if (isNaN(article_id) || !Number.isInteger(Number(article_id)) || Number(article_id) <= 0) {
        return next({ status: 400, message: 'Bad Request: Invalid article id' });
    }
    doesArticleExist(article_id)
    .then(() => {
        return doesUsernameExist(username)
    })
    .then(() => {
        return insertComment(username, body, article_id)
    })
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}

exports.updateArticleById = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    if (isNaN(article_id) || !Number.isInteger(Number(article_id)) || Number(article_id) <= 0) {
        return next({ status: 400, message: 'Bad Request: Invalid article id' });
    }
    doesArticleExist(article_id)
    .then(() => {
        return patchArticleById(inc_votes, article_id)
    })
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    if (isNaN(comment_id) || !Number.isInteger(Number(comment_id)) || Number(comment_id) <= 0) {
        return next({ status: 400, message: 'Bad Request: Invalid comment id' });
    }
    removeComment(comment_id)
    .then(() => {
        res.status(204).end()
    })
    .catch(next)
}