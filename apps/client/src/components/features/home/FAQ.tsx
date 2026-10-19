"use client";

import { useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * Canonical FAQ content (Spanish source strings).
 * NOTE: the FAQPage JSON-LD structured data in src/app/page.tsx mirrors this
 * array — keep both in sync. Translations live in home.json `faq.items` and are
 * resolved per item key with the Spanish string as fallback.
 */
export const FAQ_ITEMS = [
    {
        key: "guides",
        question: "¿Cómo funciona el acompañamiento de vulcanólogos?",
        answer: "Todas nuestras ascensiones a cráteres activos (como el Volcán Telica, Cerro Negro o Masaya) están supervisadas por guías locales experimentados y especialistas en vulcanología, con equipo de monitoreo de gases y comunicación satelital de respaldo."
    },
    {
        key: "modify",
        question: "¿Puedo modificar el itinerario propuesto por la IA?",
        answer: "Totalmente. La inteligencia artificial elabora la base topográfica y logística óptima; posteriormente, un diseñador de viajes sénior de nuestro equipo afina cada detalle según tu ritmo y preferencias individuales."
    },
    {
        key: "transfers",
        question: "¿Qué tipo de traslados internos se utilizan?",
        answer: "Utilizamos vehículos todoterreno de lujo con chóferes profesionales, hidroaviones y lanchas rápidas privadas para el archipiélago de Solentiname y las isletas de Granada."
    },
    {
        key: "destinations",
        question: "¿Qué destinos puedo encontrar en Momotombo Travels?",
        answer: "Nos especializamos en Nicaragua, cubriendo desde las joyas coloniales de Granada y León, hasta la geología sagrada de Ometepe, el surf de Costa Esmeralda y el descanso caribeño en Corn Island."
    }
] as const;

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const { t } = useTranslation("home", { keyPrefix: "faq" });

    return (
        <section className="py-24 px-6 bg-surface-container-low/20">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
                {/* Header */}
                <div className="md:w-1/3">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">
                        {t("badge")}
                    </span>
                    <h2 className="font-serif text-4xl font-bold text-on-surface mb-4">{t("title")}</h2>
                    <p className="text-on-surface-variant text-sm">{t("subtitle")}</p>
                </div>

                {/* Accordion */}
                <div className="md:w-2/3 space-y-4">
                    {FAQ_ITEMS.map((faq, index) => (
                        <div key={faq.key} className="border-b border-outline-variant/30 pb-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                id={`faq-button-${index}`}
                                className="w-full flex justify-between items-start text-left py-4 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                            >
                                <span className="font-serif text-xl font-bold text-on-surface group-hover:text-primary transition-colors duration-200 pr-8">
                                    {t(`items.${faq.key}.question`, { defaultValue: faq.question })}
                                </span>
                                <span className="text-primary mt-1 shrink-0">
                                    {openIndex === index ? <Minus size={22} /> : <Plus size={22} />}
                                </span>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-on-surface-variant leading-relaxed pb-4 text-pretty">
                                            {t(`items.${faq.key}.answer`, { defaultValue: faq.answer })}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
