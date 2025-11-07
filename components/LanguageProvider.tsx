import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n/i18n.js'; // Explicitly import with .js extension
import { useTranslation } from 'react-i18next';

//  // Create a context for language state
const LanguageContext = createContext<{
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}>({
  currentLanguage: 'en',
  changeLanguage: () => {},
});

// Provider component to wrap the app and for language context
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { i18n } = useTranslation();

  // Effect to initialize language
  useEffect(() => {
    const supportedLanguages = ['en', 'hi', 'ta', 'te', 'ml', 'or', 'kn', 'bn', 'pa', 'as', 'mr'];
    const userLang = navigator.language.split('-')[0];
    const savedLang = localStorage.getItem('language') || userLang;
    const finalLang = supportedLanguages.includes(savedLang) ? savedLang : 'en';

    changeLanguage(finalLang);
  }, []);

  // Function to change language
  const changeLanguage = (lang: string) => {
    const supportedLanguages = ['en', 'hi', 'ta', 'te', 'ml', 'or', 'kn', 'bn', 'pa', 'as', 'mr'];
    if (supportedLanguages.includes(lang)) {
      i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};