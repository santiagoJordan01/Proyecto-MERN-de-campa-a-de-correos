import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { config } from 'dotenv';
import Bull from 'bull';

import bullBoardApi from '@bull-board/api';



import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter.js';
import { ExpressAdapter } from '@bull-board/express';




import { PORT } from './config.js';
import emailRoutes from '../routes/email.routes.js';

config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Configurar cola Bull
const emailQueue = new Bull('email-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Monitor de Bull
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter
});

app.use('/admin/queues', serverAdapter.getRouter());

// Rutas
app.use('/api/emails', emailRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando',
    endpoints: {
      monitor: 'GET /admin/queues',
      sendCampaign: 'POST /api/send-campaign'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
