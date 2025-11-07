import { TFunction } from 'i18next';

/**
 * A helper function to get translated text with fallback
 * @param t - The translation function from useTranslation hook
 * @param key - The translation key
 * @param fallback - Optional fallback text if key is not found
 * @returns The translated text or fallback
 */
export const getTranslation = (t: TFunction, key: string, fallback?: string): string => {
  const translation = t(key);
  return translation !== key ? translation : fallback || key;
};

/**
 * A helper function to check if a translation key exists
 * @param t - The translation function from useTranslation hook
 * @param key - The translation key to check
 * @returns Boolean indicating if the key has a translation
 */
export const hasTranslation = (t: TFunction, key: string): boolean => {
  return t(key) !== key;
};