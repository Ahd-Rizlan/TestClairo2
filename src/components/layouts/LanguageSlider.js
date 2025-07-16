import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSlider.css';

const LanguageSlider = () => {
  const { i18n } = useTranslation();
  
  // Languages in order: English, Tamil, Sinhala
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'ta', name: 'TA' },
    { code: 'si', name: 'SI' }
  ];
  
  // Change language handler
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  // Get current language index
  const getCurrentIndex = () => {
    return languages.findIndex(lang => lang.code === i18n.language) || 0;
  };
  
  return (
    <div className="language-slider">
      <div className="slider-track">
        {languages.map((language, index) => (
          <button
            key={language.code}
            className={`slider-option ${i18n.language === language.code ? 'active' : ''}`}
            onClick={() => changeLanguage(language.code)}
            aria-pressed={i18n.language === language.code}
          >
            {language.name}
          </button>
        ))}
        <div 
          className="slider-indicator" 
          style={{ transform: `translateX(${getCurrentIndex() * 100}%)` }}
        ></div>
      </div>
    </div>
  );
};

export default LanguageSlider;