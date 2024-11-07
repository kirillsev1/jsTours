import path from 'path';
import { fileURLToPath } from 'url';
import userModel from '../integrations/postgres/models/userModel.js';
import express from 'express';
import checkers from './utils/checkers.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/user', checkers.isAuthenticated, async (req, res) => {
    try {
        const user = await userModel.getById(req.session.user_id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/user/:offset', checkers.isAdminAuthenticated, async (req, res) => {
    const { offset } = req.params;
    try {
        const users = await userModel.getByPage(offset);
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/register', checkers.isNotAuthenticated, async (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/register.html'));
});

router.post('/register', checkers.isNotAuthenticated, async (req, res) => {
    const { username, password, is_admin } = req.body;
    try {
        const newUser = await userModel.create({ username, password, is_admin });
        console.log('Created User:', newUser);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(400).send();
    }
});

router.get('/login', checkers.isNotAuthenticated, async (req, res) => {
    if (req.session && req.session.isAuthenticated) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../pages/login.html'));
});

router.post('/login', checkers.isNotAuthenticated, async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await userModel.getByCreds(username, password);
        
        if (!user || user.length === 0) {
            return res.status(401).send();
        }

        req.session.username = username;
        req.session.user_id = user[0].id;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/logout', checkers.isAuthenticated, async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send();
        }
        res.redirect('/login');
    });
});

export default router;