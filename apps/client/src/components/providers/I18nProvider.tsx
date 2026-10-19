"use client";

import { useEffect, type ReactNode } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "dayjs/locale/en";
import { i18next } from "@/lib/i18n";

/** Keeps <html lang> and dayjs locale in sync with the active i18n language. */
function LangSync() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = i18n.language?.split("-")[0] ?? "es";
    document.documentElement.lang = lang;
    dayjs.locale(lang);
  }, [i18n.language]);
  return null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18next}>
      <LangSync />
      {children}
    </I18nextProvider>
  );
}
