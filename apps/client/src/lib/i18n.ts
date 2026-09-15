"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import esCommon from "../../public/locales/es/common.json";
import esNav from "../../public/locales/es/nav.json";
import esAuth from "../../public/locales/es/auth.json";
import esHome from "../../public/locales/es/home.json";
import esExplore from "../../public/locales/es/explore.json";
import esItinerary from "../../public/locales/es/itinerary.json";
import esProfile from "../../public/locales/es/profile.json";
import esAdmin from "../../public/locales/es/admin.json";
import esBlog from "../../public/locales/es/blog.json";
import esErrors from "../../public/locales/es/errors.json";
import esValidation from "../../public/locales/es/validation.json";

import enCommon from "../../public/locales/en/common.json";
import enNav from "../../public/locales/en/nav.json";
import enAuth from "../../public/locales/en/auth.json";
import enHome from "../../public/locales/en/home.json";
import enExplore from "../../public/locales/en/explore.json";
import enItinerary from "../../public/locales/en/itinerary.json";
import enProfile from "../../public/locales/en/profile.json";
import enAdmin from "../../public/locales/en/admin.json";
import enBlog from "../../public/locales/en/blog.json";
import enErrors from "../../public/locales/en/errors.json";
import enValidation from "../../public/locales/en/validation.json";

export const SUPPORTED_LANGUAGES = ["es", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "es";

export const LANGUAGE_LABELS: Record<Language, string> = {
  es: "Español",
  en: "English",
};

export const LANGUAGE_CODES: Record<Language, string> = {
  es: "ES",
  en: "EN",
};

export const LANGUAGE_FLAGS: Record<Language, string> = LANGUAGE_CODES;

const resources = {
  es: {
    common: esCommon,
    nav: esNav,
    auth: esAuth,
    home: esHome,
    explore: esExplore,
    itinerary: esItinerary,
    profile: esProfile,
    admin: esAdmin,
    blog: esBlog,
    errors: esErrors,
    validation: esValidation,
  },
  en: {
    common: enCommon,
    nav: enNav,
    auth: enAuth,
    home: enHome,
    explore: enExplore,
    itinerary: enItinerary,
    profile: enProfile,
    admin: enAdmin,
    blog: enBlog,
    errors: enErrors,
    validation: enValidation,
  },
} as const;

if (!i18next.isInitialized) {
  if (typeof window !== "undefined") {
    i18next.use(LanguageDetector);
  }
  void i18next
    .use(initReactI18next)
    .init({
      resources,
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
      ns: [
        "common",
        "nav",
        "auth",
        "home",
        "explore",
        "itinerary",
        "profile",
        "admin",
        "blog",
        "errors",
        "validation",
      ],
      defaultNS: "common",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        caches: ["localStorage"],
        lookupLocalStorage: "momotombo-lang",
      },
      react: {
        useSuspense: false,
      },
      load: "currentOnly",
    });
}

export function initI18n(language?: Language): typeof i18next {
  if (language && i18next.language !== language) {
    void i18next.changeLanguage(language);
  }
  return i18next;
}

export function getCurrentLanguage(): Language {
  const lang = i18next.language;
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang) ? (lang as Language) : DEFAULT_LANGUAGE;
}

export { i18next };
