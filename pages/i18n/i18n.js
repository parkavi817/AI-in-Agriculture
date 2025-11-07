import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: true,
    // Key separator is used for nested keys, we don't want to use it
    keySeparator: false,
    interpolation: {
      escapeValue: false // React already safes from XSS
    },
    // Specific to backend loading
    backend: {
      loadPath: '/locales/{{lng}}/complete.json' // Ensure it loads complete.json
    },
    ns: ['complete'], // Specify the namespace
    defaultNS: 'complete' // Set default namespace
  });

export default i18n;