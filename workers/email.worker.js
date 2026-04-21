import { Worker } from 'bullmq';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { pool } from '../config/db.js';

config();

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

    console.log(`🔌 Worker Redis -> ${opts.host}:${opts.port} tls=${!!opts.tls}`);

    return opts;
  } catch (err) {
    return { url };
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const worker = new Worker('email-queue', async (job) => {
  const { email, templateName, emailId } = job.data;

  if (!templateName || !email || !emailId) {
    throw new Error("Datos incompletos en el job");
  }

  const templatePath = path.resolve("templates", `${templateName}.html`);
  let html;

  try {
    html = fs.readFileSync(templatePath, "utf8");
  } catch (err) {
    // PostgreSQL usa $1 en lugar de ?
    await pool.query("UPDATE emails SET status = 'failed' WHERE id = $1", [emailId]);
    throw new Error(`Plantilla no encontrada: ${templatePath}`);
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "¡Te tenemos una gran noticia!",
      html,
    });

    await pool.query("UPDATE emails SET status = 'sent' WHERE id = $1", [emailId]);
    console.log(`✅ Correo enviado a: ${email}`);
  } catch (err) {
    await pool.query("UPDATE emails SET status = 'failed' WHERE id = $1", [emailId]);
    throw new Error(`Error al enviar correo a ${email}: ${err.message}`);
  }
}, {
  connection: parseRedisConnection(),
});

worker.on('error', (err) => {
  console.error('⚠️ Worker error:', err);
});