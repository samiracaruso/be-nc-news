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
    '/api/topics/nonexistent'
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