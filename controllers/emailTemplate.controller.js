import fs from "fs/promises";
import { pool } from "../config/db.js";
import { emailQueue } from "../queues/email.queue.js";

export const sendCampaign = async (req, res) => {
  const { templateName } = req.body;
  if (!templateName) {
    return res.status(400).json({ message: "Nombre de plantilla requerido" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM emails WHERE status = 'pending'");
    if (!rows.length) return res.json({ message: "No hay correos pendientes" });

    const html = await fs.readFile(`templates/${templateName}.html`, "utf8");

    for (const row of rows) {
      await emailQueue.add("sendEmail",{
        email: row.email,
        templateName,
        emailId: row.id,
      });
    }

    res.json({ message: "Campaña encolada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al encolar campaña" });
  }
};
