"use client";

import { useTranslation } from "react-i18next";

export function PressLogos() {
  const { t } = useTranslation("home", { keyPrefix: "press" });

  return (
    <section className="py-16 px-6 bg-surface-container-lowest border-t border-outline-variant/30" aria-label={t("disclaimer")}>
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-6">
          {t("disclaimer")}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-50">
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-on-surface-variant">Viajeros</span>
          <span className="font-sans text-xl md:text-2xl font-black tracking-tighter text-on-surface-variant">NICA · TRAVEL</span>
          <span className="font-serif text-xl md:text-2xl italic font-bold text-on-surface-variant">Volcanes</span>
          <span className="font-sans text-xl md:text-2xl font-bold text-on-surface-variant">Lago & Sol</span>
          <span className="font-serif text-xl md:text-2xl font-bold text-on-surface-variant">Ruta Sur</span>
        </div>
      </div>
    </section>
  );
}
