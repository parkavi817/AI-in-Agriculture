const express = require('express');
const { translate } = require('../services/translationService');

const router = express.Router();

// Get translation for a key and language
router.get('/', (req, res) => {
  const { key, lang } = req.query;
  if (!key) return res.status(400).json({ message: 'Key parameter is required' });
  const translation = translate(key, lang);
  res.json({ key, translation });
});

module.exports = router;
