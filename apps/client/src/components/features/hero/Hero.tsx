"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Sparkle, Compass, MapPin, ShieldCheck, Thermometer } from "@phosphor-icons/react";
import { destinationsService } from "@/services/destinations.service";
import type { Destination } from "@/types/destination";

export function Hero() {
    const [temperature, setTemperature] = useState<number | null>(null);
    const [heroDest, setHeroDest] = useState<Destination | null>(null);

    useEffect(() => {
        let isMounted = true;

        // 1. Fetch live real-time temperature for Mombacho / Maribios (lat: 11.826, lng: -85.984)
        fetch("https://api.open-meteo.com/v1/forecast?latitude=11.826&longitude=-85.984&current=temperature_2m")
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
                if (isMounted && data?.current?.temperature_2m != null) {
                    setTemperature(Math.round(data.current.temperature_2m));
                }
            })
            .catch(() => {
                if (isMounted) setTemperature(22);
            });

        // 2. Fetch destination data from backend
        destinationsService
            .list()
            .then((list) => {
                if (isMounted && list && list.length > 0) {
                    const found = list.find((d) => d.slug.includes("granada") || d.slug.includes("mombacho")) || list[0];
                    setHeroDest(found);
                }
            })
            .catch(() => {});

        return () => {
            isMounted = false;
        };
    }, []);

    const handleGenerate = () => {
        window.dispatchEvent(new Event("open-chat"));
    };

    return (
        <section 
            id="hero-section"
            className="px-6 md:px-12 max-w-7xl mx-auto mb-20 pt-28 pb-12 overflow-hidden relative"
        >
            {/* Ambient Travertine and Volcanic Atmosphere Glows */}
            <div className="absolute top-1/4 -left-24 w-[480px] h-[480px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute top-12 right-10 w-[520px] h-[520px] bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center min-h-[600px] md:min-h-[680px]">
                {/* Typography Column */}
                <motion.div 
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                    className="col-span-1 md:col-span-6 relative z-10 space-y-6 flex flex-col items-start justify-center"
                >
                    <span 
                        id="hero-eyebrow"
                        className="font-sans font-semibold text-xs tracking-[0.18em] text-tertiary uppercase inline-flex items-center gap-2 bg-surface-container/80 border border-outline-variant/60 px-4 py-1.5 rounded-full shadow-xs backdrop-blur-xs"
                    >
                        <Sparkle size={13} weight="fill" className="text-tertiary" />
                        <span>Tierra de Lagos y Volcanes</span>
                        <span className="text-outline/40">·</span>
                        <span className="font-mono text-[11px] text-on-surface-variant lowercase">{"12°29'N 86°32'W"}</span>
                    </span>

                    <h1 
                        id="hero-title"
                        className="font-serif text-5xl md:text-7xl font-semibold text-on-background leading-[1.12] tracking-tight text-balance"
                    >
                        Descubre el Alma de <br />
                        <span className="text-primary italic font-normal">Nicaragua</span>
                    </h1>

                    <p 
                        id="hero-description"
                        className="font-sans text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed text-pretty"
                    >
                        Expediciones diseñadas con inteligencia artificial que fusionan la fuerza volcánica y la naturaleza salvaje con la hospitalidad colonial más exclusiva. El viaje, reinventado.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                        <button
                            onClick={handleGenerate}
                            id="hero-generate-button"
                            className="group relative inline-flex items-center gap-2.5 bg-primary hover:bg-primary-hover text-on-primary px-8 py-4 rounded-full font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-300 active:scale-[0.97] shadow-sm hover:shadow-md cursor-pointer"
                        >
                            <span>Diseñar Expedición IA</span>
                            <Sparkle size={14} weight="fill" className="text-on-primary-container group-hover:rotate-12 transition-transform duration-300" />
                        </button>

                        <Link
                            href="/explorar"
                            id="hero-explore-button"
                            className="inline-flex items-center gap-2 font-sans font-semibold text-xs tracking-wider uppercase text-on-surface hover:text-primary transition-all py-3.5 px-6 rounded-full border border-outline-variant/60 hover:border-primary/40 bg-surface-container-low/70 backdrop-blur-xs group active:scale-[0.97]"
                        >
                            <Compass size={16} className="text-secondary group-hover:rotate-45 transition-transform" />
                            <span>Explorar Destinos</span>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-outline-variant/40 w-full max-w-xl">
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                            <ShieldCheck size={16} weight="fill" className="text-secondary shrink-0" />
                            <span>Vulcanólogos Certificados</span>
                        </div>
                        <div className="hidden sm:block h-3 w-px bg-outline-variant/50" />
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                            <Sparkle size={15} weight="fill" className="text-tertiary shrink-0" />
                            <span>Curaduría IA & Humana</span>
                        </div>
                        <div className="hidden sm:block h-3 w-px bg-outline-variant/50" />
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                            <Star size={15} weight="fill" className="text-primary shrink-0" />
                            <span>Relais & Châteaux Partners</span>
                        </div>
                    </div>
                </motion.div>

                {/* Imagery Column (Cinematic Asymmetric Spread from Stitch) */}
                <div className="col-span-1 md:col-span-6 relative h-[480px] md:h-[560px] mt-6 md:mt-0 flex items-center justify-center">
                    {/* Main Panoramic Frame */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.96, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                        className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/60 group bg-surface-container"
                    >
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvNdbvt0IpFvZ8JMUEhE3ohn0fW_NOAqWe49Ss-QQMuNpskgTzbUmbHuBd23_xO35tWRHO66XW_Fn1tlz1prz2VbN3A-Q0wwku8oRpNpVuG8ODSw2dkZr-ywa_1NojVkLpEdGs9JQ2YXnPSpPtXBhEvyx1yj8BZTZEhNGJrftKS1ShvNWqmQrhURIggLJ5BjipOdyUoGhcmxZ3O-kT6RDqB1o9mx2oxccmjyAJ6wZFAnBMGqo6TbPjltUuHtzee0DCT2b3UEGFpQ0E"
                            alt="Volcán Mombacho y mirador hacia Granada Colonial"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-105 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-volcano-black/80 via-volcano-black/20 to-transparent" />

                        {/* Floating Luxury Card Inset */}
                        <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/50 shadow-lg text-on-surface">
                            <div className="flex items-center justify-between mb-2">
                                <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-primary font-sans font-bold text-[10px] tracking-wider uppercase">
                                    Charter Privado
                                </span>
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="font-bold text-on-surface">
                                        {heroDest?.rating ? heroDest.rating.toFixed(1) : "4.9"}
                                    </span>
                                    <div className="flex items-center text-tertiary">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={13} weight="fill" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <h2 className="font-serif text-lg font-bold text-on-surface mb-1">
                                {heroDest?.name || "Volcán Mombacho & Granada Colonial"}
                            </h2>
                            <div className="flex items-center gap-3 text-xs text-on-surface-variant font-sans">
                                <span className="flex items-center gap-1">
                                    <MapPin size={13} className="text-primary" weight="fill" />
                                    1,344 msnm
                                </span>
                                <span>•</span>
                                <span>{heroDest?.category?.name || "Bosque Nuboso Privado"}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Accent Volcanic Live Tag */}
                    <div className="hidden sm:flex absolute -top-3 -right-3 z-20 bg-primary text-on-primary px-3.5 py-1.5 rounded-full shadow-lg items-center gap-2 font-mono text-[11px] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-oro-indigena animate-ping" />
                        <Thermometer size={14} weight="bold" />
                        <span>{temperature !== null ? `TEMPERATURA ACTUAL: ${temperature}°C` : "MONITOREANDO CLIMA..."}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
