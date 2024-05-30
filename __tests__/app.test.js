const app = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpointJSON = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("404: Page Not Found", () => {
  test(`Should return 404 for misspelled endpoints`, () => {
    return request(app)
      .get('/api/bad-endpoint')
      .expect(404)
      .then(({ body }) => {
        expect(body.error.message).toBe("Page Not Found");
      });
  });
});

describe("GET /api/topics", () => {
  test("Responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  test("Responds with an object of all apis", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const { endpoints } = response.body;
        expect(endpoints).toEqual(endpointJSON);
        expect(endpoints).toMatchObject(endpointJSON);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Returns an error 400 if an invalid type of id is passed", () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({ body }) => {
        expect(body.error.message).toBe("Bad Request: Invalid article id");
      });
  });
  test('Responds with error 404 for a nonexistent article', () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.error.message).toBe("Page Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("Responds with an array of articles with a comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSorted("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Reponds with an array with all comments relative to the article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSorted("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("Responds with an empty array if there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(0);
      });
  });
  test("Responds with an error 400 for an invalid id type", () => {
    return request(app)
      .get("/api/articles/one/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.error.message).toBe("Bad Request: Invalid article id");
      });
  });
  test('Responds with a 404 for a nonexisting article', () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.error.message).toBe("Page Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Returns the posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "This is where the fun begins!",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual({
          comment_id: expect.any(Number),
          body: "This is where the fun begins!",
          article_id: 3,
          author: "lurker",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("Responds with an error 400 for an invalid id type", () => {
    return request(app)
      .post("/api/articles/one/comments")
      .send({ username: "lurker", body: "This is where the fun begins!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.error.message).toBe("Bad Request: Invalid article id");
      });
  });
  test("Responds with an error 404 for a nonexistent id", () => {
    return request(app)
      .post("/api/articles/99999/comments")
      .send({ username: "lurker", body: "This is where the fun begins!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.error.message).toBe("Page Not Found");
      });
  });
  test("Responds with an error 401 for an invalid username", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({ username: "anon123", body: "No idea what I am doing" })
      .expect(401)
      .then(({ body }) => {
        expect(body.error.message).toBe("Invalid Username");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Responds with the updated article", () => {
    const votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/2")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 1,
          article_img_url: expect.any(String),
        });
      });
  });
  test("Responds with a 404 if the article does not exist", () => {
    const votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999999")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.error.message).toBe("Page Not Found");
      });
  });
  test("Responds with a 400 if the article id type is invalid", () => {
    const votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/seven")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.error.message).toBe("Bad Request: Invalid article id");
      });
  });
  test("Responds with a 400 if the inc_votes data type is invalid", () => {
    const votes = { inc_votes: "one" };
    return request(app)
      .patch("/api/articles/3")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.error.message).toBe("Bad Request: Invalid inc_votes data");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Responds with a 204 confirming comment has been deleted", () => {
    return request(app)
      .delete("/api/comments/5")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("Responds with a 404 if the comment does not exist", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.error.message).toBe("No comment found");
      });
  });
  test("Responds with a 400 if the comment id type is invalid", () => {
    return request(app)
      .delete("/api/comments/eight")
      .expect(400)
      .then(({ body }) => {
        expect(body.error.message).toBe("Bad Request: Invalid comment id");
      });
  });
});

describe("/api/users", () => {
  test("It returns an array containing user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
