import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
dotenv.config();

//docker run --name js_pg -p 5432:5432 -e POSTGRES_USER=tours_user -e POSTGRES_PASSWORD=tours_password -e POSTGRES_DB=tours -d postgres:13.3
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

