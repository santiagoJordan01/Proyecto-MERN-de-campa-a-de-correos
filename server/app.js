import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { config } from 'dotenv';
import Bull from 'bull';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
config();

// Rutas y controladores
import emailRoutes from '../routes/email.routes.js';

// Bull Board para monitoreo
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter.js';
import { ExpressAdapter } from '@bull-board/express';

// Ejecutar el worker de envío de correos
import('../workers/email.worker.js');

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// Verificar que la carpeta uploads/ exista
// ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("📁 Carpeta 'uploads' creada");
}

// ----------------------
// Middleware
// ----------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/uploads", express.static("uploads"));

// ----------------------
// Configurar cola Bull
// ----------------------
const emailQueue = new Bull('email-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// ----------------------
// Bull Board (monitor)
// ----------------------
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter
});

// ----------------------
// Rutas API (antes del frontend)
// ----------------------
app.use('/api/emails', (req, res, next) => {
  console.log(`📨 [${req.method}] ${req.originalUrl}`);
  next();
}, emailRoutes);

app.use('/admin/queues', serverAdapter.getRouter());

// ----------------------
// Servir frontend (React)
// ----------------------
const clientPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// ----------------------
// Iniciar servidor
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
