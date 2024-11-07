import express from 'express';
import { expect } from 'chai';
import reviewModel from '../src/integrations/postgres/models/reviewModel.js';
import reviewRouter from '../src/api/review.js';
import request from 'supertest';
import mockSeeion from 'mock-session'

const app = express();
app.use(express.json());
app.use('/', reviewRouter);

const mockReviews = [
    {
        "id": 6,
        "user_id": 1,
        "tour_id": 1,
        "rating": 5,
        "comment": "tet"
    },
    {
        "id": 7,
        "user_id": 1,
        "tour_id": 1,
        "rating": 5,
        "comment": "tet"
    }
];

const mockReview = { id: 1, user_id: 1, tour_id: 1, rating: 5, comment: 'Great tour!' };

describe('GET /review/:offset', () => {
    before(() => {
        reviewModel.getByPage = (offset) => {
            return Promise.resolve(mockReviews);
        }
    });

    after(() => {
        delete reviewModel.getByPage;
    });

    it('should return list of reviews', async () => {
        const response = await request(app)
            .get('/review/1')

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal(mockReviews);
    });
});


describe('GET /review/:tour_id/:offset', () => {
    beforeEach(() => {
        reviewModel.getByPageTourId = (offset, id) => {
            return Promise.resolve(mockReviews);
        }
    });

    after(() => {
        delete reviewModel.getByPage;
    });

    it('should return list of reviews', async () => {
        const response = await request(app)
            .get('/review/1/1')

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal(mockReviews);
    });
});

describe('POST /review/:tour_id/:offset', () => {
    beforeEach(() => {
        reviewModel.create = (reviewData) => {
            return Promise.resolve({ ...mockReview, ...reviewData });
        };
    });

    after(() => {
        delete reviewModel.getByPage;
    });

    it('should return new review', async () => {
        let cookie = mockSeeion('my-session', 'my-secret', {"username":"test"})
        const response = await request(app)
            .post('/review')
            .set('cookie', [cookie])
            .send({
                tour_id: 1,
                rating: 5,
                comment: 'Great tour!'
            });

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal(mockReview);
    });
});