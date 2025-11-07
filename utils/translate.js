import fs from 'fs';
import path from 'path';

// Cache loaded translation files to avoid repeated disk reads
const translationCache = new Map();

/**
 * Load translation JSON for a given language.
 * Falls back to English if the file does not exist.
 *
 * @param {string} lng - Language code (e.g., 'en', 'hi')
 * @returns {object} - Parsed translation object
 */
function loadTranslations(lng) {
  const normalizedLng = (lng || 'en').toLowerCase();
  if (translationCache.has(normalizedLng)) {
    return translationCache.get(normalizedLng);
  }

  const localesPath = path.resolve(
    process.cwd(),
    'public',
    'locales',
    normalizedLng,
    'complete.json'
  );

  let data = {};
  try {
    const raw = fs.readFileSync(localesPath, 'utf-8');
    data = JSON.parse(raw);
  } catch (err) {
    // If loading fails, fallback to English
    if (normalizedLng !== 'en') {
      return loadTranslations('en');
    }
  }
  translationCache.set(normalizedLng, data);
  return data;
}

/**
 * Translate a key using the loaded translations.
 *
 * @param {string|number} key - The key from complete.json (e.g., '80' for "Dashboard")
 * @param {string} lng - Desired language code
 * @returns {string} - Translated string or the key itself if not found
 */
export function t(key, lng) {
  const translations = loadTranslations(lng);
  const value = translations[key];
  if (value !== undefined) {
    return value;
  }
  // Fallback to English if key missing in selected language
  if ((lng || '').toLowerCase() !== 'en') {
    const enTranslations = loadTranslations('en');
    return enTranslations[key] ?? String(key);
  }
  return String(key);
}
