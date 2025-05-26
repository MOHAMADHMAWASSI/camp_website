import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      fr: {
        translation: frTranslations
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

export default i18n;