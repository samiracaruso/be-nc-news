const db = require('../../db/connection')

exports.doesArticleExist = (article_id) => {
return db.query(`SELECT * FROM articles
WHERE article_id = $1;`, [article_id])
.then((response) => {
    if (response.rows.length === 0){
        return Promise.reject({status: 404, message: 'Page Not Found'})
    }
    return article_id
})
}

exports.selectComments = (article_id) => {
return db.query(`SELECT * FROM comments
WHERE article_id = $1
ORDER BY created_at DESC;`, [article_id])
.then((response) => {
    return response.rows
})
}

exports.insertComment = (newComment, article_id) => {
const {username, body} = newComment
return db.query(`INSERT INTO comments (author, body, article_id)
VALUES ($1, $2, $3)
RETURNING *;`, [username, body, article_id])
.then(({rows}) => {
    return rows[0]
})
}