const db = require('../../db/connection')

exports.selectArticleById = (article_id) => {

    return db.query('SELECT * FROM articles where article_id = $1;', [article_id])
    .then((response) => {
        if (response.rows.length === 0){
            return Promise.reject({status: 404, message: 'Page Not Found'})
        }
        return response.rows[0]
    })
}

exports.selectArticles = () => {
    return db.query(`SELECT 
    a.author,
    a.title,
    a.article_id,
    a.topic,
    a.created_at,
    a.votes,
    a.article_img_url,
    COUNT(c.comment_id) AS comment_count
FROM 
    articles a
LEFT JOIN 
    comments c ON a.article_id = c.article_id
GROUP BY 
    a.author,
    a.title,
    a.article_id,
    a.topic,
    a.created_at,
    a.votes,
    a.article_img_url
ORDER BY 
    a.created_at DESC;`)
    .then((response) => {
        return response.rows
    })
}
