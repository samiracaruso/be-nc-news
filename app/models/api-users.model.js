const db = require('../../db/connection')

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then((response) => {
        console.log(response.rows)
        return response.rows
    })
}