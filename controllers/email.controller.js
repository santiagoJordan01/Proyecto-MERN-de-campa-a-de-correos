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
        const email = data.email || data.Email || data.EMAIL; // Maneja diferentes capitalizaciones
        // Validar si el email es válido antes de agregarlo a los resultados
        if (email && validateEmail(email)) {
          results.push(email);
        }
      })
      .on('end', async () => {
        const uniqueEmails = [...new Set(results)];

        for (const email of uniqueEmails) {
          await pool.query(
            'INSERT IGNORE INTO emails (email, status) VALUES (?, ?)',
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
