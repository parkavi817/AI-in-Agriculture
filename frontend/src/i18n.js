import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load translation files from the backend static folder
i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // Not using i18next-http-backend; we’ll load JSON via fetch in a custom loader
    },
    resources: {}, // will be populated dynamically if needed
  // Load static locale strings from the backend public folder
  // This fetch runs once when the module is imported
  // and adds the complete.json bundle to i18n.
  // The backend serves it under /locales/en/complete.json
  // (see server.js static folder configuration).
  // If the fetch fails we simply continue with an empty bundle.
  // The dynamic translation utility will fill missing keys at runtime.
  // eslint-disable-next-line no-undef
  (async () => {
    try {
      const resp = await fetch('/locales/en/complete.json');
      if (resp.ok) {
        const data = await resp.json();
        i18n.addResourceBundle('en', 'translation', data, true, true);
      }
    } catch (e) {
      console.error('Failed to load static locale file:', e);
    }
  })();
  });

export default i18n;
