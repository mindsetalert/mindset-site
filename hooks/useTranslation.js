import { useLanguage } from '../contexts/LanguageContext';
import frTranslations from '../translations/fr.json';
import enTranslations from '../translations/en.json';

const translations = {
  fr: frTranslations,
  en: enTranslations,
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Retourne la clé si la traduction n'est pas trouvée
      }
    }
    
    if (typeof value === 'string') {
      // Remplacer les paramètres dans la chaîne
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }
    
    return value || key;
  };
  
  return { t, language };
};


