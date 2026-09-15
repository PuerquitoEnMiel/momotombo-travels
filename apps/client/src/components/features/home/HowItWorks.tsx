"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChatTeardrop, Sparkle, Backpack } from "@phosphor-icons/react";

const STEP_KEYS = ["talk", "plan", "travel"] as const;
type StepKey = (typeof STEP_KEYS)[number];

const STEP_ICONS: Record<StepKey, React.ReactNode> = {
  talk: <ChatTeardrop size={36} weight="duotone" />,
  plan: <Sparkle size={36} weight="duotone" />,
  travel: <Backpack size={36} weight="duotone" />,
};

export function HowItWorks() {
  const { t } = useTranslation("home", { keyPrefix: "howItWorks" });

  return (
    <section className="py-24 px-4 bg-colonial-cream/40">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-laguna-blue font-bold tracking-widest uppercase text-sm mb-2 block">
          {t("badge")}
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-volcano-black mb-16 text-balance">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-outline-variant -z-10" aria-hidden="true" />

          {STEP_KEYS.map((key, index) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="relative bg-surface-container-lowest p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="w-24 h-24 bg-laguna-blue/10 text-laguna-blue rounded-full flex items-center justify-center mb-6 mx-auto">
                {STEP_ICONS[key]}
              </div>
              <h3 className="font-serif text-2xl font-bold text-volcano-black mb-4 text-balance">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-on-surface-variant leading-relaxed text-pretty">
                {t(`steps.${key}.description`)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
