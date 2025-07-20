import { Worker } from 'bullmq';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { pool } from '../config/db.js';

config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

new Worker('email-queue', async (job) => {
  const { email, templateName, emailId } = job.data;

  if (!templateName || !email || !emailId) {
    throw new Error("Datos incompletos en el job");
  }

  const templatePath = path.resolve("templates", `${templateName}.html`);
  let html;

  try {
    html = fs.readFileSync(templatePath, "utf8");
  } catch (err) {
    await pool.query("UPDATE emails SET status = 'failed' WHERE id = ?", [emailId]);
    throw new Error(`Plantilla no encontrada: ${templatePath}`);
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "¡Te tenemos una gran noticia!",
      html,
    });

    await pool.query("UPDATE emails SET status = 'sent' WHERE id = ?", [emailId]);
    console.log(`✅ Correo enviado a: ${email}`);
  } catch (err) {
    await pool.query("UPDATE emails SET status = 'failed' WHERE id = ?", [emailId]);
    throw new Error(`Error al enviar correo a ${email}: ${err.message}`);
  }
}, {
  connection: {
    url: process.env.REDIS_URL,
  }
});
