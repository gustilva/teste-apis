import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import * as enTranslation from './i18n/en/translation.json';
import * as esTranslation from './i18n/es/translation.json';
import * as ptBrTranslation from './i18n/pt-br/translation.json';
import { environment } from '@spesia/data-access';

const resources = {
    ptBr: {
        translation: ptBrTranslation
    },
    en: {
        translation: enTranslation
    },
    es: {
        translation: esTranslation
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: environment.defaultLanguage,
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: [],
            caches: []
        }
    }).then();

export default i18n;
