import { translateStrings } from './App'; // reuse the existing translate helper

/**
 * Recursively extracts all string values from an object and builds a flat map.
 * Keys are dot‑joined paths (e.g., "weather.description").
 */
function extractStrings(obj, path = [], map = {}) {
  if (typeof obj === 'string') {
    const key = path.join('.');
    map[key] = obj;
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => extractStrings(item, path.concat(idx), map));
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([k, v]) => extractStrings(v, path.concat(k), map));
  }
  return map;
}

/**
 * Rebuilds an object by replacing its string values with translated ones.
 */
function rebuildObject(obj, translations, path = []) {
  if (typeof obj === 'string') {
    const key = path.join('.');
    return translations[key] ?? obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item, idx) => rebuildObject(item, translations, path.concat(idx)));
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    Object.entries(obj).forEach(([k, v]) => {
      result[k] = rebuildObject(v, translations, path.concat(k));
    });
    return result;
  }
  return obj;
}

/**
 * Translates all string fields inside a JSON payload using the backend /api/translate endpoint.
 * Returns a new object with translated strings.
 *
 * @param {string} targetLang - Language code (e.g., 'hi', 'ta')
 * @param {object} data - Arbitrary JSON data from any API
 * @returns {Promise<object>} - Data with translated strings
 */
export async function translateData(targetLang, data) {
  const flatMap = extractStrings(data);
  if (Object.keys(flatMap).length === 0) {
    return data; // nothing to translate
  }
  const translated = await translateStrings(targetLang, flatMap);
  return rebuildObject(data, translated);
}
