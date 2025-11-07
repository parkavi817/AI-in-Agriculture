import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Status endpoint
router.get('/status', (req, res) => {
  res.json({ ok: true, message: 'Translation service is up' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonScript = path.join(__dirname, '..', 'translation_service.py');

// POST /api/translate
// Expected body: { targetLang: 'hi', strings: { key1: 'text', key2: 'text' } }
router.post('/', async (req, res) => {
  const { targetLang, strings } = req.body;
  if (!targetLang || !strings || typeof strings !== 'object') {
    return res.status(400).json({ message: 'targetLang and strings are required' });
  }

  // Call FastAPI translation service for each string
  try {
    const results = {};
    for (const [key, txt] of Object.entries(strings)) {
      const resp = await fetch('http://localhost:8000/api/v1/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: txt, to_lang: targetLang })
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`FastAPI error: ${errText}`);
      }
      const data = await resp.json();
      results[key] = data.translated_text;
    }
    res.json({ translated: results });
  } catch (e) {
    console.error('FastAPI translation error:', e);
    res.status(500).json({ message: 'Translation service failed' });
  }
});

export default router;
