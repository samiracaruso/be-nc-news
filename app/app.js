const cors = require('cors');

app.use(cors());

const express = require('express')

const {getTopics, getApis, getArticleById, getArticles, getComments, addComment, updateArticleById, deleteComment, getUsers} = require('./controllers/controller')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getApis)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', addComment)

app.patch('/api/articles/:article_id', updateArticleById)

app.delete('/api/comments/:comment_id', deleteComment)

app.get('/api/users', getUsers)

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