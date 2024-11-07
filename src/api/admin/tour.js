import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import checkers from '../utils/checkers.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', checkers.isAdminAuthenticated, async (req, res) => {
    res.sendFile(path.join(__dirname, '../../pages/admin_essence.html'));
});

export default router;