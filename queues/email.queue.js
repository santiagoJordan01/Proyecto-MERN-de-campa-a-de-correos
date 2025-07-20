// queues/email.queue.js
import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

export const emailQueue = new Queue('email-queue', {
  connection: {
    url: process.env.REDIS_URL,
  },
});
