"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Compass, Star, ArrowRight } from "@phosphor-icons/react";
import { destinationsService } from "@/services/destinations.service";
import type { Destination } from "@/types/destination";

// High-fidelity fallback imagery for curated destination photography
const CURATED_IMAGE_MAP: Record<string, string> = {
    "granada": "https://lh3.googleusercontent.com/aida-public/AB6AXuAsMfMbRNo6KUhT2tZCFGD497qCCDheHUt8cCtokXMQwZa6WW7wXC7VMnO00VhcMAJQTthd2a_5MzuVvNyv2r8lmrn0bkz9rbPeG7f33gT2F-FDdMLpBRQThZSHFT6g6sLSbcG9bbNxeKlVuq0568J31QrBNZ1fO4DXkpi7Q1OAc-keSWDViS5VU6hJHA4j1f3F7yBDKkKgq8mKn3_EgtDQl1VXBPexi4m6pwWwk1hkyjipKn0_FpSeeVinmktD7F3_uA8GLQKA1_mP",
    "ometepe": "https://lh3.googleusercontent.com/aida-public/AB6AXuD-YYlE5imGsvK9-jIaJ4oJnxunIVwYL9ZzunZLmGN1ivgyIkXZu1V1M9sFHxwHGskiA3tE6OCT5UVy6OQJdxkhX8aRzcUYG0TvYR3Y52QgyTLNMthgc5wVisCOoTzfp01zyThJRTwwEcCH9axiFBwuov2fX7DDuBghknHZt73A_WBEMrdC1hdtD1n79I-RCtLNcpTafejTr3CMI5kqNGQ-uMzOY2bEJWkNqiDRt-l-Nt2Y7aZC246vLXsWl6pgZoe8q2zRQzK6zDSJ",
    "san-juan-del-sur": "https://lh3.googleusercontent.com/aida-public/AB6AXuDT56L_A76EwQlQFyQsJHyNPS6UUIm2uqD50uVIbaGt5lInzVSv4orDUhTu1m41DBGjE3xaQ_RQr47TpYMN8QuvF_IUe6gPWdvqVO4viNmQAs679iD99D6WNIupbUC23E4XEjcB5MRKxwK66MYNVKydLAZpdYj634PFy1si5Y60E4D4K-Yy9dqi5MJ-bXYPX-TLdJFlVeFDHu5YXTOsQ9FsdbR3E2nRH4uWNU3ru5X7L0C7Vt2BOVEezbQOFWVDNLiCPQS5VCFB9kUA",
    "leon": "https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=1200&auto=format&fit=crop",
    "corn-island": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1200&auto=format&fit=crop",
};

const CATEGORY_FILTERS = [
    { label: "Todas las Expediciones", slug: "" },
    { label: "Ciudades Coloniales", slug: "colonial" },
    { label: "Volcanes & Aventura", slug: "aventura" },
    { label: "Playas & Surf", slug: "playa" },
    { label: "Reservas & Selva", slug: "naturaleza" },
];

function getPriceSymbol(level?: string | null): string {
    switch (level?.toUpperCase()) {
        case "HIGH":
        case "EXPENSIVE":
            return "$$$";
        case "MEDIUM":
        case "MODERATE":
            return "$$";
        default:
            return "$";
    }
}

function getDestinationImage(dest: Destination): string {
    const primaryImg = dest.images?.find((img) => img.isHero)?.url || dest.images?.[0]?.url;
    if (primaryImg && !primaryImg.includes("placehold.co") && !primaryImg.includes("via.placeholder")) {
        return primaryImg;
    }
    return CURATED_IMAGE_MAP[dest.slug] || "https://images.unsplash.com/photo-1580610447943-1bfbef5efe07?q=80&w=1200&auto=format&fit=crop";
}

export function FeaturedDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("");

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        destinationsService
            .list(activeFilter || undefined)
            .then((data) => {
                if (isMounted) {
                    setDestinations(data || []);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [activeFilter]);

    return (
        <section id="destinations" className="py-24 px-6 md:px-12 bg-surface-container-low/50 dark:bg-volcano-black/40 border-y border-outline-variant/40">
            <div className="max-w-7xl mx-auto">
                {/* Header Editorial Stitch */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-3 max-w-2xl">
                        <span className="font-sans font-semibold text-xs tracking-[0.2em] text-tertiary uppercase inline-flex items-center gap-2 bg-surface-container px-3.5 py-1 rounded-full border border-outline-variant/50">
                            <Compass size={14} weight="fill" className="text-secondary" />
                            Geografía de Lagos y Fuego
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-on-background tracking-tight">
                            Expediciones Exclusivas
                        </h2>
                        <p className="text-base md:text-lg text-on-surface-variant font-sans leading-relaxed">
                            De la piedra basáltica de los Maribios a los arrecifes cristalinos del Caribe: itinerarios curados que respetan el pulso natural de Nicaragua.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {CATEGORY_FILTERS.map((filter) => {
                            const isSelected = activeFilter === filter.slug;
                            return (
                                <button
                                    key={filter.label}
                                    onClick={() => setActiveFilter(filter.slug)}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? "bg-primary text-on-primary shadow-sm"
                                            : "bg-surface-container-lowest text-on-surface-variant hover:text-primary hover:bg-surface-container border border-outline-variant/50"
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-surface rounded-2xl p-4 border border-outline-variant/30 animate-pulse space-y-4">
                                <div className="h-72 bg-surface-container rounded-xl w-full" />
                                <div className="h-6 bg-surface-container rounded w-3/4" />
                                <div className="h-4 bg-surface-container rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : destinations.length === 0 ? (
                    <div className="text-center py-16 bg-surface rounded-2xl border border-outline-variant/40 space-y-3">
                        <Compass size={36} className="mx-auto text-primary/60 animate-spin" />
                        <h3 className="font-serif text-xl font-semibold">No se encontraron expediciones en esta categoría</h3>
                        <p className="text-sm text-on-surface-variant">Prueba seleccionando otra categoría o restablece el filtro.</p>
                        <button
                            onClick={() => setActiveFilter("")}
                            className="text-xs font-bold uppercase tracking-wider text-primary underline underline-offset-4 cursor-pointer"
                        >
                            Ver Todas
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((dest, index) => {
                            const isSpan = (index === 0 || index === 3) && destinations.length > 2;
                            const imageUrl = getDestinationImage(dest);
                            const priceSymbol = getPriceSymbol(dest.priceLevel);
                            const ratingScore = dest.rating || 4.8;
                            const categoryName = dest.category?.name || "Expedición";

                            return (
                                <motion.div
                                    key={dest.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
                                    viewport={{ once: true }}
                                    className={`group cursor-pointer active:scale-[0.985] transition-all duration-300 ${
                                        isSpan ? "md:col-span-2 lg:col-span-2" : ""
                                    }`}
                                >
                                    <Link
                                        href={`/explorar/${dest.slug}`}
                                        id={`dest-link-${dest.slug}`}
                                        className="block h-full bg-surface border border-outline-variant/50 hover:border-primary/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="relative h-72 md:h-80 w-full overflow-hidden rounded-xl mb-4 bg-surface-container">
                                            {/* Price Badge */}
                                            <div className="absolute top-3 right-3 z-10 bg-volcano-black/85 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono font-semibold border border-white/10">
                                                {priceSymbol}
                                            </div>

                                            {/* Category Tag */}
                                            <div className="absolute top-3 left-3 z-10 bg-surface-container-low/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-bold text-primary tracking-wider uppercase border border-outline-variant/60 shadow-xs">
                                                {categoryName}
                                            </div>

                                            <Image
                                                src={imageUrl}
                                                alt={dest.name}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-104"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-volcano-black/80 via-transparent to-transparent opacity-65 group-hover:opacity-85 transition-opacity duration-300" />

                                            {/* Inset Geolocation Details */}
                                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95 font-sans">
                                                <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-md">
                                                    <MapPin size={13} className="text-tertiary" weight="fill" />
                                                    <span>{typeof dest.location?.address === "string" ? dest.location.address : "Nicaragua"}</span>
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-[11px] bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-md font-mono">
                                                    <Star size={13} className="text-tertiary" weight="fill" />
                                                    <span>{ratingScore.toFixed(1)}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-serif text-2xl font-bold text-on-background group-hover:text-primary transition-colors duration-200">
                                                    {dest.name}
                                                </h3>
                                                {dest.activities && dest.activities.length > 0 && (
                                                    <span className="font-mono text-[11px] text-tertiary uppercase tracking-widest font-semibold">
                                                        {dest.activities.length} {dest.activities.length === 1 ? "actividad" : "actividades"}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed font-sans">
                                                {dest.description}
                                            </p>

                                            <div className="pt-2 flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                                                <span>Explorar Itinerario</span>
                                                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Footer Action */}
                <div className="text-center mt-14">
                    <Link
                        href="/explorar"
                        id="dest-all-button"
                        className="inline-flex items-center gap-3 bg-primary hover:bg-primary-hover text-on-primary px-8 py-4 rounded-full font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.97]"
                    >
                        <span>Explorar Todo el Territorio Nacional</span>
                        <ArrowRight size={15} weight="bold" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

