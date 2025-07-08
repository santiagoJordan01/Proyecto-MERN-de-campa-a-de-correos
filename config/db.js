import mysql from "mysql2/promise"; // Importa mysql2 para crear el pool
import dotenv from "dotenv"; // Importa dotenv para manejar variables de entorno
// Crea pool de conexiones (mejor rendimiento)


dotenv.config(); // Carga las variables de entorno desde el archivo .env
console.log("Conectando a la base de datos...");
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

