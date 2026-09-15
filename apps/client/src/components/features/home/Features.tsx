"use client";

import { MapTrifold, Compass, CalendarBlank, Users } from "@phosphor-icons/react";

import Image from "next/image";

const features = [
    {
        icon: <MapTrifold size={32} weight="light" />,
        title: "La única app de viajes que necesitas",
        description: "Organiza tu viaje en minutos, tenlo todo en un solo lugar.",
    },
    {
        icon: <Compass size={32} weight="light" />,
        title: "Encuentra ideas de viaje listas para usar",
        description: "Creadas a partir de viajes reales, las ideas te servirán para imaginarte tu viaje y personalizarlo para ti.",
    },
    {
        icon: <CalendarBlank size={32} weight="light" />,
        title: "Guías y mapas para tu próximo destino",
        description: "Ahorra tiempo buscando, nosotros ya hemos creado las guías que necesitas para tu viaje.",
    },
    {
        icon: <Users size={32} weight="light" />,
        title: "Momotombo Travel Club",
        description: "Únete a la comunidad y recibe información puntera del sector travel. Miles de travelers ya forman parte.",
    },
];

export function Features() {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Image Placeholder - Could be a phone mockup */}
                <div className="hidden md:block relative h-[600px] bg-gray-100 rounded-3xl overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1596423736287-192f592f694d?q=80&w=800&auto=format&fit=crop"
                        alt="App Mockup"
                        fill
                        sizes="(max-w-768px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>

                {/* Features List */}
                <div className="flex flex-col justify-center gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="flex gap-6">
                            <div className="text-oro-indigena shrink-0">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-volcano-black mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
