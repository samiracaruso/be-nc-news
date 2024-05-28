const express = require('express')

const {getTopics, getApis, getArticleById} = require('./controllers/controller')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getApis)

app.get('/api/articles/:article_id', getArticleById)


// 404 Middleware
app.use((req, res, next) => {
    const err = new Error('Page Not Found')
    err.status = 404
    next(err)
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || 'Internal Server Error'
    res.status(status).json({ error: { message } })
})

module.exports = app