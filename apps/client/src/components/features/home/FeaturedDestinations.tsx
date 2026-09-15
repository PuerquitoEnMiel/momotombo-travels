"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, SunHorizon, Compass } from "@phosphor-icons/react";

interface DestinationItem {
    id: number;
    name: string;
    slug: string;
    category: string;
    image: string;
    description: string;
    altitude: string;
    region: string;
    season: string;
    badgeColor?: string;
    price: string;
}

const destinations: DestinationItem[] = [
    {
        id: 1,
        name: "Granada & Volcán Mombacho",
        slug: "granada",
        category: "Colonial & Selva",
        image: "https://images.unsplash.com/photo-1580610447943-1bfbef5efe07?q=80&w=800&auto=format&fit=crop",
        description: "La Gran Sultana fundada en 1524, con paseos en las 365 Isletas y senderos de bosque nuboso en el Mombacho.",
        altitude: "34 - 1,344 msnm",
        region: "Gran Lago Cocibolca",
        season: "Nov – May (Clima seco)",
        price: "$$",
    },
    {
        id: 2,
        name: "Isla de Ometepe",
        slug: "ometepe",
        category: "Reserva de Biósfera UNESCO",
        image: "https://images.unsplash.com/photo-1564100994-434854583e6e?q=80&w=800&auto=format&fit=crop",
        description: "Santuario mitológico formado por los volcanes gemelos Concepción y Maderas emergiendo del agua dulce.",
        altitude: "1,610 msnm",
        region: "Rivas Insular",
        season: "Todo el año",
        price: "$",
    },
    {
        id: 3,
        name: "San Juan del Sur",
        slug: "san-juan-del-sur",
        category: "Costa & Surf",
        image: "https://images.unsplash.com/photo-1596423736287-192f592f694d?q=80&w=800&auto=format&fit=crop",
        description: "Mecca del surf pacífico con olas constantes en Playa Maderas y atardeceres dorados en bahías escondidas.",
        altitude: "Nivel del mar",
        region: "Pacífico Esmeralda",
        season: "Dic – Abr",
        price: "$$$",
    },
    {
        id: 4,
        name: "Corn Island (Islas del Maíz)",
        slug: "corn-island",
        category: "Caribe Creole",
        image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800&auto=format&fit=crop",
        description: "Aguas turquesas, barreras de coral vírgenes y ritmo caribeño pausado a 70 km de la costa nicaragüense.",
        altitude: "Caribe Insular",
        region: "Costa Caribe Sur",
        season: "Feb – Sep (Aguas calmas)",
        price: "$$$",
    },
];

export function FeaturedDestinations() {
    return (
        <section id="destinations" className="py-24 px-4 md:px-8 bg-surface-container-low/60 dark:bg-volcano-black/50 border-y border-outline-variant/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-3">
                    <span className="font-sans font-semibold text-xs tracking-[0.2em] text-secondary uppercase inline-flex items-center gap-1.5">
                        <Compass size={14} weight="fill" />
                        Geografía Imprescindible
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-volcano-black dark:text-on-surface tracking-tight">
                        Destinos de Tierra y Agua
                    </h2>
                    <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed">
                        De la piedra volcánica de los Maribios a los arrecifes caribeños: itinerarios que respetan el pulso natural de Nicaragua.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest, index) => (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
                            viewport={{ once: true }}
                            className={`group cursor-pointer active:scale-[0.98] transition-all duration-300 ${(index === 0 || index === 3) ? "md:col-span-2 lg:col-span-2" : ""}`}
                        >
                            <Link 
                                href={`/explorar/${dest.slug}`} 
                                id={`dest-link-${dest.slug}`}
                                className="block h-full bg-surface dark:bg-surface-container-low border border-outline-variant/50 hover:border-primary/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="relative h-72 md:h-80 w-full overflow-hidden rounded-xl mb-4 bg-surface-dim">
                                    <div className="absolute top-3 right-3 z-10 bg-volcano-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono font-semibold border border-white/10">
                                        {dest.price}
                                    </div>
                                    <div className="absolute top-3 left-3 z-10 bg-colonial-cream/95 dark:bg-volcano-black/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-primary dark:text-on-primary-container tracking-wider uppercase border border-outline-variant/40 shadow-2xs">
                                        {dest.category}
                                    </div>
                                    <Image
                                        src={dest.image}
                                        alt={dest.name}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-volcano-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
                                    
                                    {/* Badge hovering elevation metadata */}
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-sans">
                                        <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                                            <MapPin size={13} className="text-sunset-orange" weight="fill" />
                                            <span>{dest.altitude}</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[11px] bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md font-mono">
                                            <SunHorizon size={13} className="text-oro-indigena" />
                                            <span>{dest.season}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-serif text-2xl font-bold text-volcano-black dark:text-on-surface group-hover:text-primary transition-colors duration-200">
                                            {dest.name}
                                        </h3>
                                        <span className="font-mono text-[11px] text-on-surface-variant/70 uppercase tracking-widest">
                                            {dest.region}
                                        </span>
                                    </div>
                                    <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed font-sans">
                                        {dest.description}
                                    </p>
                                    <div className="pt-2 flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider">
                                        <span>Detalles del viaje</span>
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-14">
                    <Link
                        href="/explorar"
                        id="dest-all-button"
                        className="inline-flex items-center gap-3 bg-primary hover:bg-primary-container text-on-primary px-8 py-4 rounded-full font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.97]"
                    >
                        <span>Explorar los 15 Departamentos</span>
                        <span>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

