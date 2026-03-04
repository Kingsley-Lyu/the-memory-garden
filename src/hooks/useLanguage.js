// src/hooks/useLanguage.js
// Custom hook that manages language state and provides translation function.
// In a larger app you'd replace this with i18next or next-intl.

import { useState, useCallback } from 'react';
import en from '../locales/en.json';
import zh from '../locales/zh.json';

const translations = { en, zh };

export function useLanguage() {
  const [lang, setLang] = useState('en');

  // t('nav.memorials') → looks up translations[lang].nav.memorials
  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      let value = translations[lang];
      for (const k of keys) {
        value = value?.[k];
      }
      return value ?? key;
    },
    [lang]
  );

  return { lang, setLang, t };
}
