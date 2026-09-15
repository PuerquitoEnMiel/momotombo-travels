"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Sparkle } from "@phosphor-icons/react";

export function Hero() {
    const handleGenerate = () => {
        window.dispatchEvent(new Event("open-chat"));
    };

    return (
        <section 
            id="hero-section"
            className="px-6 md:px-12 max-w-7xl mx-auto mb-20 pt-28 pb-12 overflow-hidden"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center min-h-[600px] md:min-h-[700px]">
                {/* Typography Column */}
                <motion.div 
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                    className="col-span-1 md:col-span-5 relative z-10 space-y-6 flex flex-col items-start justify-center"
                >
                    <span 
                        id="hero-eyebrow"
                        className="font-sans font-semibold text-xs tracking-[0.2em] text-tertiary uppercase inline-flex items-center gap-1.5"
                    >
                        <Sparkle size={12} weight="fill" />
                        Edición Editorial
                    </span>
                    <h1 
                        id="hero-title"
                        className="font-serif text-5xl md:text-7xl font-semibold text-on-background leading-[1.1] tracking-tight text-balance"
                    >
                        Descubre el Alma de <br />
                        <span className="text-primary italic font-medium">Nicaragua</span>
                    </h1>
                    <p 
                        id="hero-description"
                        className="font-sans text-base md:text-lg text-on-surface-variant max-w-md leading-relaxed"
                    >
                        Viajes diseñados con inteligencia artificial que fusionan paisajes volcánicos salvajes con una hospitalidad de lujo sin igual. El viaje, rediseñado.
                    </p>
                    <div className="pt-2">
                        <button
                            onClick={handleGenerate}
                            id="hero-generate-button"
                            className="bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container px-8 py-4 rounded-full font-sans font-semibold text-xs tracking-wider uppercase transition-[transform,background-color,color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] shadow-sm cursor-pointer"
                        >
                            Generar Itinerario
                        </button>
                    </div>
                </motion.div>

                {/* Imagery Column (Overlapping) */}
                <div className="col-span-1 md:col-span-7 relative h-[450px] md:h-[620px] mt-6 md:mt-0 flex items-center justify-center">
                    {/* Background/Back Image */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 top-0 w-[82%] h-[82%] rounded-2xl overflow-hidden shadow-md z-0"
                    >
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-YMMd3CDhwhrftwkYXCjKmcpNBLHmNDN4hgA7Q2Wlsk5Iv_pS5uczU2WbUgW6ekjPp0Z9gOzmTAbYUANUXgv5ir1pnoiSnQDiDLkmUATJaEnMJ1uzE3XaXKWpOkWgnfyeoYWUC0MfywY7Tn56DFjeTOJ0RWWBTMh5DHgDMQRbjZ2ahdvEStnhfB0ZfyX56dG0zhL6y5a-vHuCzTlATlA0CBMd6IvZUKeez7sd_7_KoiJSbdN7zQ00blqpoIW01bcclx-0Mw-rkcZt"
                            alt="Breathtaking Volcanic Ridge Nicaragua"
                            fill
                            priority
                            sizes="(max-w-768px) 100vw, 50vw"
                            className="object-cover object-center transition-transform duration-700 hover:scale-103 ease-out"
                        />
                    </motion.div>

                    {/* Foreground/Front Overlapping Image */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, x: -20, y: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute left-0 bottom-0 w-[60%] h-[60%] rounded-2xl overflow-hidden shadow-lg border-4 border-surface z-10"
                    >
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp_BQxHOrAV0J-4YGpP8wXIS37iHVQjfiB58ybeyA0j3rlkrriEJTIawpYZiFh2VshTMwz_AuP3FdYB8_mjxUrWUUEam209gmkc4kGJQLTITocLG3E1mBYeDhwuTvvO1FUZhDEc0FH0sDRhDljakIFkRbLYR_tjypzaEQBSOtEhhQLChoa6rj_mND30WgTZjYiC97NEv37-cotD8MoOwmQwmIQOK8dbCSi_SSJmNVTxJRBFNSd6xnrtUIfOA61uDA1qMEyKBRaQEg5"
                            alt="Luxury Infinity Pool Resort Nicaragua"
                            fill
                            sizes="(max-w-768px) 100vw, 35vw"
                            className="object-cover transition-transform duration-700 hover:scale-103 ease-out"
                        />
                    </motion.div>

                    {/* Luxury Badge */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.45, ease: [0.23, 1, 0.32, 1] }}
                        id="hero-luxury-badge"
                        className="absolute right-6 bottom-16 z-20 bg-surface/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 border border-outline-variant/30"
                    >
                        <Star size={15} weight="fill" className="text-tertiary" />
                        <span className="font-sans font-semibold text-xs tracking-wider text-on-surface">Curated Excellence</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
