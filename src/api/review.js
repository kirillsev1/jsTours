import path from 'path';
import { fileURLToPath } from 'url';
import reviewModel from '../integrations/postgres/models/reviewModel.js';
import checkers from './utils/checkers.js';
import express from 'express';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/review/:offset', async (req, res) => {
    const { offset } = req.params;
    try {
        const reviews = await reviewModel.getByPage(offset);
        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/review/user/:offset', checkers.isAuthenticated, async (req, res) => {
    const { offset } = req.params;
    try {
        const reviews = await reviewModel.getByPageUId(offset, req.session.user_id);
        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/review/:tour_id/:offset', async (req, res) => {
    const { tour_id, offset } = req.params;
    try {
        const reviews = await reviewModel.getByPageTourId(offset, tour_id);
        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post('/review', checkers.isAuthenticated, async (req, res) => {
    const { tour_id, rating, comment } = req.body;
    try {
        const newReview = await reviewModel.create({
            user_id: req.session.user_id,
            tour_id: tour_id,
            rating: rating,
            comment: comment
        });
        res.status(201).json(newReview);
    } catch (err) {
        console.error(err);
        res.status(400).send();
    }
});

router.delete('/review/:id', checkers.isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReview = await reviewModel.delete(id, req.session.user_id);
        if (!deletedReview) {
            return res.status(404).send();
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

export default router;