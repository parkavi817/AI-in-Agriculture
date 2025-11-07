import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { translationService } from '../services/api';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (key: string) => string;
  translateText: (text: string, targetLang?: string) => Promise<string>;
  isTranslationAvailable: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Static fallback translations
const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    cropSuitability: 'Crop Suitability',
    weather: 'Weather Forecast',
    schemes: 'Government Schemes',
    cropKnowledge: 'Crop Knowledge',
    maps: 'Agricultural Maps',
    chatbot: 'AI Assistant',
    settings: 'Settings',
    marketPrice: 'Market Price',
    welcome: 'Welcome to Krishi Gyan',
    logout: 'Logout',
    title: 'Krishi Gyan'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    cropSuitability: 'फसल उपयुक्तता',
    weather: 'मौसम पूर्वानुमान',
    schemes: 'सरकारी योजनाएं',
    cropKnowledge: 'फसल ज्ञान',
    maps: 'कृषि मानचित्र',
    chatbot: 'AI सहायक',
    settings: 'सेटिंग्स',
    marketPrice: 'बाजार मूल्य',
    welcome: 'कृषि ज्ञान में आपका स्वागत है',
    logout: 'लॉगआउट',
    title: 'कृषि ज्ञान'
  },
  pa: {
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    cropSuitability: 'ਫਸਲ ਉਪਯੁਕਤਤਾ',
    weather: 'ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ',
    schemes: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ',
    cropKnowledge: 'ਫਸਲ ਗਿਆਨ',
    maps: 'ਖੇਤੀ ਨਕਸ਼ੇ',
    chatbot: 'AI ਸਹਾਇਕ',
    settings: 'ਸੈਟਿੰਗਜ਼',
    marketPrice: 'ਬਾਜ਼ਾਰ ਮੁੱਲ',
    welcome: 'ਕ੍ਰਿਸ਼ੀ ਗਿਆਨ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
    logout: 'ਲੌਗਆਉਟ',
    title: 'ਕ੍ਰਿਸ਼ੀ ਗਿਆਨ'
  }
};

// Right-to-left (RTL) languages
const rtlLanguages = ['ur', 'ar', 'fa'];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { user, updateUserSettings } = useAuth();
  const [language, setLanguageState] = useState('en'); // Renamed to avoid conflict with context function
  const [isTranslationAvailable, setIsTranslationAvailable] = useState(false);

  // Check Lingva Translate availability
  useEffect(() => {
    const checkTranslationService = async () => {
      try {
        const available = await translationService.isServiceAvailable();
        setIsTranslationAvailable(available);
        if (!available) console.warn('Lingva Translate is not available.');
      } catch (error) {
        console.warn('Could not check translation service:', error);
        setIsTranslationAvailable(false);
      }
    };
    checkTranslationService();
  }, []);

  // Load language preference from user settings on mount or user change
  useEffect(() => {
    if (user?.preferences?.language) {
      setLanguageState(user.preferences.language);
    } else {
      // Fallback to default if no user preference
      setLanguageState('en');
    }
  }, [user]);

  // Update <title> and direction when language changes
  useEffect(() => {
    const title = translations[language]?.title || 'Krishi Gyan';
    document.title = title;

    if (rtlLanguages.includes(language)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    if (user) {
      try {
        await updateUserSettings({ preferences: { language: lang } });
      } catch (error) {
        console.error('Failed to save language preference to server:', error);
      }
    }
  };

  const translate = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const translateText = async (text: string, targetLang?: string): Promise<string> => {
    const targetLanguage = targetLang || language;
    if (targetLanguage === 'en' || !isTranslationAvailable) return text;

    try {
      return await translationService.translateText(text, targetLanguage);
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      translate, 
      translateText, 
      isTranslationAvailable 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
