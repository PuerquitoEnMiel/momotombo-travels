"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CaretDown, Globe, Check } from "@phosphor-icons/react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, LANGUAGE_FLAGS, type Language } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false), open);

  const current = (SUPPORTED_LANGUAGES as readonly string[]).includes(i18n.language)
    ? (i18n.language as Language)
    : "es";

  const handleSelect = (lang: Language) => {
    void i18n.changeLanguage(lang);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Cambiar idioma"
        className={cn(
          "inline-flex items-center gap-2 px-3 h-9 rounded-full text-xs font-semibold uppercase tracking-wider",
          "border border-outline-variant/40 hover:border-primary hover:text-primary",
          "transition-all duration-200 ease-out-expo active:scale-[0.97]",
          "bg-surface-container-lowest text-on-surface-variant"
        )}
      >
        <Globe size={14} weight="bold" />
        <span aria-hidden="true">{LANGUAGE_FLAGS[current]}</span>
        <span className="hidden sm:inline">{current.toUpperCase()}</span>
        <CaretDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            "absolute right-0 top-full mt-2 w-44 z-[1500]",
            "bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl",
            "py-1 overflow-hidden"
          )}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = current === lang;
            return (
              <li key={lang} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(lang)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-on-surface hover:bg-surface-container"
                  )}
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    {LANGUAGE_FLAGS[lang]}
                  </span>
                  <span className="flex-1 text-left">{LANGUAGE_LABELS[lang]}</span>
                  {isSelected && <Check size={14} weight="bold" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
