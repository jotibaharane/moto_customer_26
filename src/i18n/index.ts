import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './resources/en.json';
import hi from './resources/hi.json';
import mr from './resources/mr.json';

// Detect device language
const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (Array.isArray(locales) && locales.length > 0) {
    return locales[0].languageCode;
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: getDeviceLanguage(), // auto detect
  // lng: 'mr', // default to English
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already safe
  },
});

export default i18n;
