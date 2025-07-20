import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

config(); // Cargar .env

// Rutas y controladores
import emailRoutes from '../routes/email.routes.js';

// Ejecutar el worker
import('../workers/email.worker.js');

// BullMQ y Bull Board
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { ExpressAdapter } from '@bull-board/express';

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// Verificar carpeta uploads
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
app.use("/uploads", express.static("uploads"));

// ----------------------
// Crear cola BullMQ con URL de Redis (Upstash)
// ----------------------
const emailQueue = new Queue('email-queue', {
  connection: {
    url: process.env.REDIS_URL // Ejemplo: redis://default:password@upstash.io:6379
  },
});

// ----------------------
// Bull Board (Dashboard)
// ----------------------
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

// ----------------------
// API Routes
// ----------------------
app.use('/api/emails', (req, res, next) => {
  console.log(`📨 [${req.method}] ${req.originalUrl}`);
  next();
}, emailRoutes);

// ----------------------
// Frontend (React)
// ----------------------
const clientPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// ----------------------
// Iniciar servidor
// ----------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
