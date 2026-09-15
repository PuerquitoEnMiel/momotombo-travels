"use client";

import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";

export function Manifesto() {
  const { t } = useTranslation("home", { keyPrefix: "manifesto" });

  return (
    <section className="py-32 px-6 bg-colonial-cream/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block"
        >
          {t("badge")}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-serif text-4xl md:text-6xl font-bold text-volcano-black leading-tight mb-8 text-balance"
        >
          <Trans
            i18nKey="home:manifesto.title"
            components={{ br: <br /> }}
          />{" "}
          <span className="text-primary">{t("titleAccent")}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-on-surface-variant max-w-2xl mx-auto text-pretty"
        >
          {t("description")}
        </motion.p>
      </div>
    </section>
  );
}
