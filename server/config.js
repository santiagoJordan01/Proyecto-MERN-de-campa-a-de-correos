export const PORT =5000;
// config/db.js
import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';
config();

// Render te dará una variable DATABASE_URL o DB_URL
const pool = new Pool({
  connectionString: process.env.DB_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export { pool };