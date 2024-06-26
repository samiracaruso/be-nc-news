const db = require("../../db/connection");
const { doesTopicExist } = require("./api-topics.model");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT 
    a.article_id,
    a.title,
    a.body,
    a.votes,
    a.topic,
    a.author,
    a.created_at,
    a.article_img_url,
    COUNT(c.comment_id) AS comment_count
  FROM articles a
  LEFT JOIN comments c ON a.article_id = c.article_id
  WHERE a.article_id = $1
  GROUP BY a.article_id;`, [article_id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Page Not Found" });
      }
      return response.rows[0];
    });
};

exports.selectArticles = async (topic) => {
  const queryValues = [];

  let sqlQuery = `SELECT 
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
    comments c ON a.article_id = c.article_id`;

    if (topic) {
        await doesTopicExist(topic);
        sqlQuery += ` WHERE a.topic = $1`;
        queryValues.push(topic);
    }

  sqlQuery += ` GROUP BY 
a.author,
a.title,
a.article_id,
a.topic,
a.created_at,
a.votes,
a.article_img_url
ORDER BY 
a.created_at DESC;`;

const response = await db.query(sqlQuery, queryValues);
return response.rows;
};

exports.patchArticleById = (inc_votes, article_id) => {
  if (isNaN(inc_votes) || !Number.isInteger(Number(inc_votes))) {
    return Promise.reject({
      status: 400,
      message: "Bad Request: Invalid inc_votes data",
    });
  }

  return db
    .query(
      `UPDATE articles
    SET votes = $1
    WHERE article_id = $2
    RETURNING *`,
      [inc_votes, article_id]
    )
    .then((response) => {
      return response.rows[0];
    });
};
