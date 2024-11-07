import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import authRouter from './api/auth.js';
import tourRouter from './api/tour.js';
import reviewRouter from './api/review.js';
import restTourRouter from './api/rest/tour.js';
import adminTourRouter from './api/admin/tour.js';
import { initializeTables } from './integrations/postgres/init.js';

dotenv.config();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}));

app.use(express.static(path.join(__dirname, 'pages')));
app.use('/', authRouter)
app.use('/', tourRouter)
app.use('/', reviewRouter)
app.use('/rest/tour', restTourRouter)
app.use('/admin/tour', adminTourRouter)

initializeTables()

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
