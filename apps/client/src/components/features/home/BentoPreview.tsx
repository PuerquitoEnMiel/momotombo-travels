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
            id="bento-preview-section"
            className="bg-volcano-black text-surface py-24 px-6 md:px-12 mt-16 rounded-t-[2rem]"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span 
                            id="bento-eyebrow"
                            className="font-sans font-semibold text-xs text-oro-indigena tracking-[0.15em] uppercase mb-2 block"
                        >
                            Vista Previa de IA
                        </span>
                        <h2 
                            id="bento-title"
                            className="font-serif text-3xl md:text-5xl font-semibold text-white"
                        >
                            Ruta &ldquo;Mística de Ometepe&rdquo;
                        </h2>
                    </div>
                    <Link
                        href="/explorar/ometepe"
                        id="bento-details-button"
                        className="hidden md:flex items-center gap-1.5 text-surface hover:text-oro-indigena transition-colors duration-200 font-sans font-semibold text-xs tracking-wider uppercase group"
                    >
                        Ver Detalles Completos 
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Bento Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]"
                >
                    {/* Bento Item 1: Large Image */}
                    <motion.div 
                        variants={itemVariants}
                        id="bento-card-large-image"
                        className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group cursor-pointer"
                    >
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7WEqouYYAxCVDmhjkrsad7KesxDCdf3AYPQ3KPVNdnvQVB9ni-7Y8h-LOvTmy0scZdDk0yPZDMeNLD6Ju1shzTtqAzSS_fGteyoJRAexDI2-xzwg93i9tE0Rxjc1zrDwVzMRnbDlIjbo1Eqb6qyrmPTxZDbNl1Cv-hF3bLeD1qfE1CwAJH6sIfVzKDPgoM8a16lNnxnL86owhHzK9pBy48iCHlIg85Dxdr11Q2yqBtygxDtbfDgATETsH8q-oYHQf6uRJA2cjAj8e"
                            alt="Mística Isla de Ometepe"
                            fill
                            sizes="(max-w-768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="bg-oro-indigena text-volcano-black px-2 py-0.5 rounded-sm font-sans font-bold text-[10px] tracking-wider uppercase mb-3 inline-block">
                                Día 1-3
                            </span>
                            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white">
                                Ascenso Volcánico
                            </h3>
                        </div>
                    </motion.div>

                    {/* Bento Item 2: AI Note Card */}
                    <motion.div 
                        variants={itemVariants}
                        id="bento-card-ai-note"
                        className="md:col-span-1 md:row-span-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 border-t-2 border-t-oro-indigena flex flex-col justify-between"
                    >
                        <div>
                            <Sparkle size={20} weight="fill" className="text-oro-indigena mb-4 animate-pulse" />
                            <p className="font-sans text-xs md:text-sm text-gray-300 leading-relaxed italic line-clamp-4">
                                &ldquo;Basándome en tu preferencia por caminatas de intensidad media, seleccioné el sendero del Volcán Maderas. Ofrece una cobertura densa del bosque nuboso y vistas espectaculares.&rdquo;
                            </p>
                        </div>
                        <span className="font-sans font-bold text-[10px] tracking-wider uppercase text-white/50">
                            Momotombo AI
                        </span>
                    </motion.div>

                    {/* Bento Item 3: Small Image */}
                    <motion.div 
                        variants={itemVariants}
                        id="bento-card-small-image"
                        className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden relative group cursor-pointer"
                    >
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdrG3nwqeX5dj8iJf8BzjuU6IhNpwWCvCcqthhH1gPxsWaqLYTH9J_vTroTFYqeEce0KK4nW94MUG7mw9MF1ULFz4n_NyPiHcsbM18_mefbEXALu3FtRIXNpziwMQyjrf-VXjk0eKtbaHJWTiGzJtkPEVshjZ9sVBmDa4Saj-5cABpagkAsWmHnQUfLHiLilwxp2EYwthyxgmnustm4kpiLxCUqFiHj0PlRFkUxRntqcbUVUfYVnF27UkLcoCh4H6lc_FHW7htUK2M"
                            alt="Jungle Eco Lodge Stay"
                            fill
                            sizes="(max-w-768px) 100vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                        />
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <p className="font-serif text-lg font-medium text-white drop-shadow-sm">
                                Estadía en Eco-Lodge
                            </p>
                        </div>
                    </motion.div>

                    {/* Bento Item 4: Stats Card */}
                    <motion.div 
                        variants={itemVariants}
                        id="bento-card-stats"
                        className="md:col-span-2 md:row-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-around"
                    >
                        <div className="text-center">
                            <span className="block font-serif text-4xl md:text-5xl font-bold text-oro-indigena">5</span>
                            <span className="font-sans font-semibold text-[10px] tracking-wider uppercase text-gray-400">Días</span>
                        </div>
                        <div className="h-10 w-px bg-white/10"></div>
                        <div className="text-center">
                            <span className="block font-serif text-4xl md:text-5xl font-bold text-white">2</span>
                            <span className="font-sans font-semibold text-[10px] tracking-wider uppercase text-gray-400">Locaciones</span>
                        </div>
                        <div className="h-10 w-px bg-white/10"></div>
                        <div className="text-center">
                            <span className="block font-serif text-3xl md:text-4xl font-bold text-white">Mod</span>
                            <span className="font-sans font-semibold text-[10px] tracking-wider uppercase text-gray-400">Dificultad</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Mobile detail link */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/explorar/ometepe"
                        className="inline-flex items-center gap-1.5 text-white hover:text-oro-indigena transition-colors duration-200 font-sans font-semibold text-xs tracking-wider uppercase"
                    >
                        Ver Detalles Completos <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
