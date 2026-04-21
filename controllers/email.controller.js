// controllers/email.controller.js
import fs from 'fs';
import csv from 'csv-parser';
import { pool } from '../config/db.js';

export const uploadCSV = async (req, res) => {
  const results = [];

  try {
    if (!req.file) return res.status(400).json({ message: 'CSV no proporcionado' });

    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const email = data.email || data.Email || data.EMAIL;
        if (email && validateEmail(email)) {
          results.push(email);
        }
      })
      .on('end', async () => {
        const uniqueEmails = [...new Set(results)];

        // Cambio principal: usar INSERT ... ON CONFLICT en lugar de INSERT IGNORE
        // Placeholders $1, $2 en lugar de ?
        // Ajusta el nombre de la columna a 'email' (si tu tabla tiene 'recipient_email', mira la nota abajo)
        for (const email of uniqueEmails) {
          await pool.query(
            `INSERT INTO emails (email, status) 
             VALUES ($1, $2) 
             ON CONFLICT (email) DO NOTHING`,
            [email, 'pending']
          );
        }

        res.json({ message: `Se cargaron ${uniqueEmails.length} correos.` });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar el archivo' });
  }
};

const validateEmail = (email) => {
  const response = /\S+@\S+\.\S+/;
  return response.test(email);
};