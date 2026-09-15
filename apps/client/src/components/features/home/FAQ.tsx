"use client";

import { useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "¿Qué es Momotombo Travels y cómo funciona?",
        answer: "Momotombo Travels es tu guía de viaje inteligente. Utilizamos inteligencia artificial para crear itinerarios personalizados en segundos, basándonos en tus gustos y presupuesto. Es como tener un experto local en tu bolsillo 24/7."
    },
    {
        question: "¿Tiene algún costo?",
        answer: "La planificación básica con Kary es completamente gratuita. Puedes generar itinerarios, explorar destinos y recibir recomendaciones sin costo alguno. Ofrecemos servicios premium para reservas y asistencia personalizada en viaje."
    },
    {
        question: "¿Qué destinos puedo encontrar?",
        answer: "Nos especializamos en Nicaragua, 'La Tierra de Lagos y Volcanes'. Cubrimos desde las ciudades coloniales como Granada y León, hasta las playas de San Juan del Sur y las joyas naturales como Ometepe y Corn Island."
    },
    {
        question: "¿A quién está dirigido?",
        answer: "A todo tipo de viajeros: aventureros solitarios, parejas, familias y grupos de amigos. Si quieres descubrir la verdadera esencia de Nicaragua sin complicaciones, Momotombo es para ti."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
                {/* Header */}
                <div className="md:w-1/3">
                    <h2 className="font-serif text-4xl font-bold text-volcano-black mb-4">FAQ</h2>
                    <p className="text-gray-500">Preguntas frecuentes</p>
                </div>

                {/* Accordion */}
                <div className="md:w-2/3 space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                id={`faq-button-${index}`}
                                className="w-full flex justify-between items-start text-left py-4 group cursor-pointer focus:outline-none"
                            >
                                <span className="font-serif text-xl font-bold text-volcano-black group-hover:text-primary transition-colors duration-200 pr-8">
                                    {faq.question}
                                </span>
                                <span className="text-primary mt-1 shrink-0">
                                    {openIndex === index ? <Minus size={24} /> : <Plus size={24} />}
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
                                        <p className="text-gray-600 leading-relaxed pb-4">
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
