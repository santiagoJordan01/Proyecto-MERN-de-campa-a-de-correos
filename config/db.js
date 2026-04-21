import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DB_URL, // Render te da esta variable
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones externas
  },
});