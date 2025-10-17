import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          language === 'fr'
            ? 'bg-amber-500 text-neutral-900'
            : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-amber-500 text-neutral-900'
            : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;












