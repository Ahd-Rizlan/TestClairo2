import i18n from 'i18next'; // importing i18n library
import { initReactI18next } from 'react-i18next'; // importing react integration to connect i18 with react components
import Backend from 'i18next-http-backend'; // importing backend plugin to load transaltion files
import LanguageDetector from 'i18next-browser-languagedetector'; //importing plugin to detect user's language from local storage

i18n
   //calls the plugins to work
  .use(Backend) 
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', //sets english as the default language
    lng: localStorage.getItem('i18nextLng') || 'en', //tries to get the previously selected language from (ls) , if not found sets default
    supportedLngs: ['en', 'ta', 'si'], // declares the supported languages
    backend: {
      loadPath: '/locales/{{lng}}.json', 
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Listens for the language change and store it in the localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  document.documentElement.lang = lng;
});

export default i18n;