// routes/email.routes.js
import express from 'express';
import multer from 'multer';
import { uploadCSV } from '../controllers/email.controller.js'; // Adjust the path as necessary';
import path from 'path';
import { sendCampaign } from '../controllers/emailTemplate.controller.js';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload-csv', upload.single('csv'), uploadCSV);

router.post('/send-campaign', sendCampaign);



export default router;
