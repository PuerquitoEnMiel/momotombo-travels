"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const destinations = [
    {
        id: 1,
        name: "Granada",
        slug: "granada",
        category: "Colonial",
        image: "https://images.unsplash.com/photo-1580610447943-1bfbef5efe07?q=80&w=800&auto=format&fit=crop",
        description: "La Gran Sultana, joya colonial a orillas del Gran Lago.",
        price: "$$",
    },
    {
        id: 2,
        name: "Isla de Ometepe",
        slug: "ometepe",
        category: "Naturaleza",
        image: "https://images.unsplash.com/photo-1564100994-434854583e6e?q=80&w=800&auto=format&fit=crop",
        description: "Un oasis de paz formado por dos volcanes en medio del lago.",
        price: "$",
    },
    {
        id: 3,
        name: "San Juan del Sur",
        slug: "san-juan-del-sur",
        category: "Playa",
        image: "https://images.unsplash.com/photo-1596423736287-192f592f694d?q=80&w=800&auto=format&fit=crop",
        description: "El destino de playa más famoso, perfecto para surf y fiesta.",
        price: "$$$",
    },
    {
        id: 4,
        name: "Corn Island",
        slug: "corn-island",
        category: "Caribe",
        image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800&auto=format&fit=crop",
        description: "El paraíso caribeño de aguas turquesas y arena blanca.",
        price: "$$$",
    },
];

export function FeaturedDestinations() {
    return (
        <section id="destinations" className="py-20 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-volcano-black mb-4">
                        Destinos Imperdibles
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Desde ciudades coloniales hasta playas paradisíacas, descubre los lugares que hacen de Nicaragua un destino único.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest, index) => (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, ease: [0.23, 1, 0.32, 1] as const }}
                            viewport={{ once: true }}
                            className={`group cursor-pointer active:scale-[0.97] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${(index === 0 || index === 3) ? "md:col-span-2 lg:col-span-2" : ""}`}
                        >
                            <Link href={`/explorar/${dest.slug}`} id={`dest-link-${dest.slug}`}>
                                <div className="relative h-80 w-full overflow-hidden rounded-2xl mb-4 shadow-lg">
                                    <div className="absolute top-3 right-3 z-10 bg-primary/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold">
                                        {dest.price}
                                    </div>
                                    <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-volcano-black uppercase tracking-wider">
                                        {dest.category}
                                    </div>
                                    <Image
                                        src={dest.image}
                                        alt={dest.name}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] translate-y-2 group-hover:translate-y-0">
                                        <span className="bg-white text-volcano-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                            Ver destino →
                                        </span>
                                    </div>
                                </div>

                                <h3 className="font-serif text-2xl font-bold text-volcano-black mb-1 group-hover:text-primary transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">
                                    {dest.name}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                                    {dest.description}
                                </p>
                                <div className="flex items-center gap-1 text-primary text-sm font-medium">
                                    <span>Explorar destino</span>
                                    <span className="group-hover:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">→</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/explorar"
                        id="dest-all-button"
                        className="inline-flex items-center gap-2 bg-volcano-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-xl hover:shadow-black/20 active:scale-[0.97]"
                    >
                        Ver todos los destinos →
                    </Link>
                </div>
            </div>
        </section>
    );
}
