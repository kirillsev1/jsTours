import path from 'path';
import { fileURLToPath } from 'url';
import tourModel from '../integrations/postgres/models/tourModel.js';
import checkers from './utils/checkers.js';
import express from 'express';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/tour_page/:id', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../pages/tour.html'));
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/tour/:offset', async (req, res) => {
    const { offset } = req.params;
    try {
        const tours = await tourModel.getByPage(offset);
        res.status(200).json(tours);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/tour_id/:tour_id', async (req, res) => {
    const { tour_id } = req.params;
    try {
        const tour = await tourModel.getById(tour_id);
        if (!tour) {
            return res.status(404).send();
        }
        res.status(200).json(tour);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post('/tour', checkers.isAdminAuthenticated, async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newTour = await tourModel.create({ name, description, price });
        res.status(201).json(newTour);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.delete('/tour/:id', checkers.isAdminAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTour = await tourModel.delete(id, req.session.user_id);
        if (!deletedTour) {
            return res.status(404).send();
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

export default router;