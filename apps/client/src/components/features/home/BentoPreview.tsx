"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkle } from "@phosphor-icons/react";

export function BentoPreview() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1] as const
            }
        }
    };

    return (
        <section 
            id="itinerarios"
            className="bg-volcano-black text-surface py-24 px-6 md:px-12 rounded-t-[2.5rem] relative -mt-6 z-10 border-t border-white/5"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
                    <div>
                        <div 
                            id="bento-eyebrow"
                            className="inline-flex items-center gap-2 text-oro-indigena font-sans font-bold text-xs uppercase tracking-[0.18em] mb-3"
                        >
                            <Sparkle size={15} weight="fill" className="text-oro-indigena" />
                            <span>VISTA PREVIA DE IA · RUTA PERSONALIZADA</span>
                        </div>
                        <h2 
                            id="bento-title"
                            className="font-serif text-3xl md:text-5xl font-semibold text-white tracking-tight"
                        >
                            Ruta «Mística de Ometepe & Fuego»
                        </h2>
                    </div>
                    <Link
                        href="/explorar/ometepe"
                        id="bento-details-button"
                        className="inline-flex items-center gap-2 text-oro-indigena hover:text-white transition-colors duration-200 font-sans font-semibold text-xs tracking-wider uppercase group"
                    >
                        <span>Ver Itinerario Completo (5 Días)</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </div>

                {/* Bento Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                    {/* Bento Item 1: Large Twin Volcano Panoramic Card (7 cols) */}
                    <motion.div 
                        variants={itemVariants}
                        id="bento-card-large-image"
                        className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[380px] group border border-white/10"
                    >
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-YYlE5imGsvK9-jIaJ4oJnxunIVwYL9ZzunZLmGN1ivgyIkXZu1V1M9sFHxwHGskiA3tE6OCT5UVy6OQJdxkhX8aRzcUYG0TvYR3Y52QgyTLNMthgc5wVisCOoTzfp01zyThJRTwwEcCH9axiFBwuov2fX7DDuBghknHZt73A_WBEMrdC1hdtD1n79I-RCtLNcpTafejTr3CMI5kqNGQ-uMzOY2bEJWkNqiDRt-l-Nt2Y7aZC246vLXsWl6pgZoe8q2zRQzK6zDSJ"
                            alt="Isla de Ometepe al atardecer"
                            fill
                            sizes="(max-width: 768px) 100vw, 60vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-volcano-black via-volcano-black/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="px-3 py-1 rounded-full bg-selva-esmeralda text-white font-sans font-bold text-[10px] tracking-wider uppercase mb-3 inline-block">
                                Día 1 al 3 · Selva & Cráter
                            </span>
                            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-2">
                                Ascenso Privado al Volcán Concepción & Aguas Termales
                            </h3>
                            <p className="font-sans text-xs md:text-sm text-gray-300 max-w-lg leading-relaxed">
                                Transfer en hidroavión privado directo desde Managua a la pista de Ometepe. Pernocta con vista despejada al lago de agua dulce más vasto de Centroamérica.
                            </p>
                        </div>
                    </motion.div>

                    {/* Bento Item 2: AI Concierge Dispatch (5 cols) */}
                    <motion.div 
                        variants={itemVariants}
                        id="bento-card-ai-note"
                        className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-md relative overflow-hidden"
                    >
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-volcan-magma/15 rounded-full blur-3xl pointer-events-none" />
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                                    <Sparkle size={20} weight="fill" className="text-oro-indigena" />
                                </div>
                                <div>
                                    <h4 className="font-sans font-bold text-sm text-white">Kary · Concierge Algorítmico</h4>
                                    <span className="font-sans text-[11px] text-oro-indigena tracking-wide">Optimizando según tu perfil aventurero</span>
                                </div>
                            </div>
                            <blockquote className="font-serif text-lg md:text-xl text-gray-200 italic mb-4 leading-snug">
                                &ldquo;Seleccionamos el sendero del Volcán Maderas por su microclima de bosque nuboso cerrado y laguna esmeralda en el cráter, esquivando las horas de mayor radiación solar.&rdquo;
                            </blockquote>
                        </div>
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                            <span>Ajuste de altitud automático</span>
                            <span className="px-2.5 py-1 rounded bg-white/10 font-mono text-oro-indigena font-bold text-[11px]">98% Precisión Térmica</span>
                        </div>
                    </motion.div>

                    {/* Bento Item 3: Luxury Rainforest Stay (5 cols) */}
                    <motion.div 
                        variants={itemVariants}
                        id="bento-card-small-image"
                        className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[260px] border border-white/10 group"
                    >
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuANODvupX4zs6HvaM8fRVIx6YhLAqyZ4u_ttZ2C3IWdy732cPLHkqQcPmcF2tCMyPNdoI7DaOeeoyZ7mM2TPCsYEgCPsW4IEe5YuWGpE95LdHcSkKQncVdUkclBKPfYvk0Z5opsrICZCA9xN5QuyyRDffMNf3ZvBhsJmiT8yphjVzmU2Uoxlx8lpv-JR5mRUZLFFT_2S74W78NA7CDqRwL6x8AZ-7NZ8ePIf34Ohq_Le1SqJmRWvBVDAYd6cA1FCD2cR2NDEmdMNvLL"
                            alt="Lodge ecológico en la jungla de Ometepe"
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-volcano-black via-volcano-black/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-oro-indigena font-sans font-bold text-[10px] tracking-widest uppercase block mb-1">HOSPEDAJE EXCLUSIVO</span>
                            <h4 className="font-serif text-xl font-semibold text-white mb-1">Sanctuary Teak Retreat</h4>
                            <p className="font-sans text-xs text-gray-300">Arquitectura bioclimática en teca con spa termal al aire libre.</p>
                        </div>
                    </motion.div>

                    {/* Bento Item 4: Expedition Metrics & Logistics (7 cols) */}
                    <motion.div 
                        variants={itemVariants}
                        id="bento-card-stats"
                        className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-center"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                            <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-4">
                                <span className="font-sans font-bold text-[10px] text-oro-indigena tracking-widest uppercase">DURACIÓN EXACTA</span>
                                <p className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">5 Días / 4 Noches</p>
                                <p className="font-sans text-xs text-gray-400 mt-0.5">Ritmo contemplativo y activo</p>
                            </div>
                            <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-4">
                                <span className="font-sans font-bold text-[10px] text-oro-indigena tracking-widest uppercase">DIFICULTAD FÍSICA</span>
                                <p className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">Nivel Moderado</p>
                                <p className="font-sans text-xs text-gray-400 mt-0.5">Adaptable a solicitud</p>
                            </div>
                            <div>
                                <span className="font-sans font-bold text-[10px] text-oro-indigena tracking-widest uppercase">LOGÍSTICA INCLUIDA</span>
                                <p className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">100% Puerta a Puerta</p>
                                <p className="font-sans text-xs text-gray-400 mt-0.5">Aéreo, terrestre y lacustre</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Mobile detail link */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/explorar/ometepe"
                        className="inline-flex items-center gap-1.5 text-white hover:text-oro-indigena transition-colors duration-200 font-sans font-semibold text-xs tracking-wider uppercase"
                    >
                        <span>Ver Itinerario Completo</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
