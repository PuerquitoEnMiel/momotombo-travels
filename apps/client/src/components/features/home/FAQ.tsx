"use client";

import { useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "¿Cómo funciona el acompañamiento de vulcanólogos?",
        answer: "Todas nuestras ascensiones a cráteres activos (como el Volcán Telica, Cerro Negro o Masaya) están supervisadas por científicos y guías certificados por el INETER, con equipo de monitoreo de gases y comunicación satelital ininterrumpida."
    },
    {
        question: "¿Puedo modificar el itinerario propuesto por la IA?",
        answer: "Totalmente. La inteligencia artificial elabora la base topográfica y logística óptima; posteriormente, un diseñador de viajes sénior de nuestro equipo afina cada detalle según tu ritmo y preferencias individuales."
    },
    {
        question: "¿Qué tipo de traslados internos se utilizan?",
        answer: "Utilizamos vehículos todoterreno de lujo con chóferes profesionales, hidroaviones y lanchas rápidas privadas para el archipiélago de Solentiname y las isletas de Granada."
    },
    {
        question: "¿Qué destinos puedo encontrar en Momotombo Travels?",
        answer: "Nos especializamos en Nicaragua, cubriendo desde las joyas coloniales de Granada y León, hasta la geología sagrada de Ometepe, el surf de Costa Esmeralda y el descanso caribeño en Corn Island."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 px-6 bg-surface-container-low/20">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
                {/* Header */}
                <div className="md:w-1/3">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">
                        Claridad
                    </span>
                    <h2 className="font-serif text-4xl font-bold text-on-surface mb-4">FAQ</h2>
                    <p className="text-on-surface-variant text-sm">Preguntas frecuentes y respuestas claras</p>
                </div>

                {/* Accordion */}
                <div className="md:w-2/3 space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-outline-variant/30 pb-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                id={`faq-button-${index}`}
                                className="w-full flex justify-between items-start text-left py-4 group cursor-pointer focus:outline-none"
                            >
                                <span className="font-serif text-xl font-bold text-on-surface group-hover:text-primary transition-colors duration-200 pr-8">
                                    {faq.question}
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
                                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-on-surface-variant leading-relaxed pb-4 text-pretty">
                                            {faq.answer}
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
