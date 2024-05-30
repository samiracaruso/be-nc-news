const db = require('../../db/connection')

exports.selectTopics = () => {
    let sqlQuery = 'SELECT * FROM topics'

    sqlQuery += ';'

    return db.query(sqlQuery)
    .then((response) => {
        return response.rows
    })
}

exports.doesTopicExist = (topic) => {
    return db.query(`SELECT * FROM topics
    WHERE slug = $1`, [topic])
    .then((response) => {
        if (response.rows.length === 0){
            return Promise.reject({status: 404, message: 'Topic Not Found'})
        }
        return topic
    })
}
