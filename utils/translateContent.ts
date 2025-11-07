import { TFunction } from 'i18next';

/**
 * Translates content based on type
 * @param t - The translation function
 * @param content - The content to translate (string, array, or object)
 * @returns Translated content
 */
export const translateContent = (t: TFunction, content: any): any => {
  if (typeof content === 'string') {
    return t(content);
  }
  
  if (Array.isArray(content)) {
    return content.map(item => translateContent(t, item));
  }
  
  if (typeof content === 'object' && content !== null) {
    const translated: any = {};
    for (const key in content) {
      if (Object.prototype.hasOwnProperty.call(content, key)) {
        translated[key] = translateContent(t, content[key]);
      }
    }
    return translated;
  }
  
  return content;
};