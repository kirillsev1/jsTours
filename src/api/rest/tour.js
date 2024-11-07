import path from 'path';
import { fileURLToPath } from 'url';
import tourModel from '../../integrations/postgres/models/tourModel.js';
import express from 'express';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', async (req, res) => {
    try {
        const tours = await tourModel.getAll();
        res.status(200).json(tours);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tour = await tourModel.getById(id);
        if (!tour) {
            return res.status(404).send();
        }
        res.status(200).json(tour);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post('/', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newTour = await tourModel.create({ name, description, price });
        res.status(201).json(newTour);
    } catch (err) {
        console.error(err);
        res.status(400).send();
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    try {
        const updatedTour = await tourModel.update(id, { name, description, price });
        if (!updatedTour) {
            const createdTour = await tourModel.create({ name, description, price });
            return res.status(201).json(createdTour);
        }
        res.status(204).json(updatedTour);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTour = await tourModel.restDelete(id);
        if (!deletedTour) {
            return res.status(404).send();
        }
        res.status(204).json(deletedTour);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

export default router;