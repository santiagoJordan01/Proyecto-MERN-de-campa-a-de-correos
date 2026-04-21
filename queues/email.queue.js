// queues/email.queue.js
import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

function parseRedisConnection() {
  const url = process.env.REDIS_URL;
  if (!url) {
    return {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
      username: process.env.REDIS_USER || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
    };
  }

  try {
    const parsed = new URL(url);
    const opts = {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port) : undefined,
      username: parsed.username || undefined,
      password: parsed.password || undefined,
    };

    if (process.env.REDIS_TLS === 'true' || parsed.protocol === 'rediss:') {
      opts.tls = {};
    }

    console.log(`🔌 Redis -> ${opts.host}:${opts.port} tls=${!!opts.tls}`);

    return opts;
  } catch (err) {
    return { url };
  }
}

export const emailQueue = new Queue('email-queue', {
  connection: parseRedisConnection(),
});
