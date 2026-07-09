import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import hubEn from './hub/en.json';
import hubFr from './hub/fr.json';
import hubEs from './hub/es.json';
import missionsEn from './hub/missions/en.json';
import missionsFr from './hub/missions/fr.json';
import missionsEs from './hub/missions/es.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = 'pandagarde-language';

const mergeHub = <T extends { hub?: unknown }>(
  base: T,
  hub: typeof hubEn,
  missions: typeof missionsEn
) => ({
  ...base,
  hub: {
    ...hub,
    missions: missions.missions,
    ageGroupDescriptions: missions.ageGroupDescriptions,
  },
});

const resources = {
  en: { translation: mergeHub(en, hubEn, missionsEn) },
  fr: { translation: mergeHub(fr, hubFr, missionsFr) },
  es: { translation: mergeHub(es, hubEs, missionsEs) },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.split('-')[0];
});

document.documentElement.lang = i18n.language.split('-')[0];

export default i18n;
