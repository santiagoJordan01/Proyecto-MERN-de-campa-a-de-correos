import { emailQueue } from "../queues/email.queue.js";
import { pool } from "../config/db.js";
import nodemailer from "nodemailer";
import fs from "fs";
import dotenv from "dotenv";
import Bull from "bull";
import path from "path";
dotenv.config();







// Procesar los trabajos

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

emailQueue.process(async (job, done) => {
  const { email, templateName, emailId } = job.data;

  if (!templateName || !email || !emailId) {
    console.error("❌ Faltan datos en job:", job.data);
    return done(new Error("Datos incompletos"));
  }

  console.log(`🚀 Enviando correo a: ${email} con plantilla: ${templateName}`);

  // Leer la plantilla
  const templatePath = path.resolve("templates", `${templateName}.html`);

  let html;
  try {
    html = fs.readFileSync(templatePath, "utf8");
  } catch (err) {
    console.error(`❌ Plantilla no encontrada: ${templatePath}`);
    await pool.query("UPDATE emails SET status = 'failed' WHERE id = ?", [
      emailId,
    ]);
    return done(new Error("Plantilla no encontrada"));
  }

  // Configura Mailjet (o cualquier servicio que uses)
  // Ejemplo con nodemailer (Mailjet requiere su API)

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "¡Te tenemos una gran noticia!",
      html,
    });

    await pool.query("UPDATE emails SET status = 'sent' WHERE id = ?", [
      emailId,
    ]);
    console.log(`✅ Correo enviado a: ${email}`);
    done();
  } catch (err) {
    console.error(`❌ Error al enviar a ${email}:`, err.message);
    await pool.query("UPDATE emails SET status = 'failed' WHERE id = ?", [
      emailId,
    ]);
    done(err);
  }
});
