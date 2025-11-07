import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translateData } from './translateUtils';

// Simple API helper – points to the backend running on port 5000
const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState('en');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  // Example of a dynamic payload you might receive from an API (chatbot, weather, etc.)
  const samplePayload = {
    greeting: 'Welcome to AgroTranslate',
    description: 'Translate agricultural terms into Indian languages.',
    button: 'Click to translate',
    weather: {
      title: 'Today\'s Weather',
      summary: 'Sunny with a chance of rain in the evening.',
    },
    chatbot: {
      reply: 'How can I assist you with your farm today?',
    },
  };

  const handleTranslate = async () => {
    setError(null);
    try {
      // Translate all string fields in the payload
      const translated = await translateData(lang, samplePayload);
      setOutput(translated);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>{t('AgroTranslate Demo')}</h1>
      <label>
        Select language:{' '}
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="kn">Kannada</option>
          <option value="gu">Gujarati</option>
          <option value="pa">Punjabi</option>
          <option value="bn">Bengali</option>
        </select>
      </label>
      <button onClick={handleTranslate} style={{ marginLeft: '1rem' }}>
        Translate
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Translated payload:</h3>
          <pre>{JSON.stringify(output, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
