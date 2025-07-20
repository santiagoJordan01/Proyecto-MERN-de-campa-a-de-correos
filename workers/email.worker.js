import { Worker } from "bullmq";
import { pool } from "../config/db.js";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Crear transportador de correo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Crear Worker
const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { email, templateName, emailId } = job.data;

    if (!templateName || !email || !emailId) {
      console.error("❌ Faltan datos en job:", job.data);
      throw new Error("Datos incompletos");
    }

    console.log(`🚀 Enviando correo a: ${email} con plantilla: ${templateName}`);

    // Leer plantilla HTML
    const templatePath = path.resolve("templates", `${templateName}.html`);

    let html;
    try {
      html = fs.readFileSync(templatePath, "utf8");
    } catch (err) {
      console.error(`❌ Plantilla no encontrada: ${templatePath}`);
      await pool.query("UPDATE emails SET status = 'failed' WHERE id = ?", [emailId]);
      throw new Error("Plantilla no encontrada");
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
      console.error(`❌ Error al enviar a ${email}:`, err.message);
      await pool.query("UPDATE emails SET status = 'failed' WHERE id = ?", [emailId]);
      throw err;
    }
  },
  {
    connection: {
      url: process.env.REDIS_URL, // Ej: redis://default:pass@host:port
    },
  }
);

// Manejadores de error
emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} falló:`, err.message);
});

emailWorker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completado exitosamente`);
});
