import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Forward the uploaded image to the Flask prediction service
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.resolve(req.file.path);
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    // Call the Flask API running on port 5001
    const flaskResponse = await axios.post('http://127.0.0.1:5001/predict', form, {
      headers: form.getHeaders(),
    });

    // Clean up the uploaded file
    fs.unlink(filePath, () => {});

    // Return the Flask prediction directly to the client
    res.status(200).json(flaskResponse.data);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to get prediction' });
  }
});

export default router;
