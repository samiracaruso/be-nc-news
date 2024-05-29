const app = require('../app/app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const endpointJSON = require('../endpoints.json')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

const endpoints = [
    '/',
    '/nonexistent',
    '/api/nonexistent',
    '/api/topics/nonexistent',
    '/api/articles/99999'
]

describe('404: Not Found', () => {
    endpoints.forEach((endpoint) => {
        test(`Should return 404 for ${endpoint}`, () => {
            return request(app)
            .get(endpoint)
            .expect(404)
            .then(({body}) => {
                expect(body.error.message).toBe('Page Not Found')
            })
        })
    })
})

describe('/api/topics', () => {
    test('Responds with an array of all topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const {topics} = body
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe('/api', () => {
    test('Responds with an object of all apis', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            const { endpoints } = response.body;
        expect(endpoints).toEqual(endpointJSON);
        expect(endpoints).toMatchObject(endpointJSON);
        })
    })
})

describe('/api/articles/:article_id', () => {
    test('Responds with an article object', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
           const {article} = body
           expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
           })
        })
    })
    test('Returns an error 400 if an invalid type of id is passed', () => {
        return request(app)
        .get('/api/articles/one')
        .expect(400)
        .then(({body}) => {
            expect(body.error.message).toBe('Bad Request: Invalid article id')
        })
    })
})

describe('/api/articles', () => {
    test('Responds with an array of articles with a comment count', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            console.log(articles)
            expect(articles).toHaveLength(13)
            expect(articles).toBeSorted('created_at', {descending: true})
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
            })
        })
    })
})