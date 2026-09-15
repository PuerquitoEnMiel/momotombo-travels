"use client";

import Image from "next/image";

export function InspirationCTA() {
    return (
        <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center text-center px-4">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=2070&auto=format&fit=crop"
                    alt="Viaje en Nicaragua"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={false}
                />
                <div className="absolute inset-0 bg-black/55" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-white">
                <h2 className="font-serif text-5xl md:text-7xl font-bold mb-8 drop-shadow-lg">
                    ¿Se te hace un mundo <br /> organizar tu viaje?
                </h2>
                <p className="text-xl md:text-2xl mb-12 font-light opacity-90">
                    Si lo que quieres es viajar, Momotombo es para ti. <br />
                    Y si no sabes por dónde empezar, escríbenos y empezamos juntos.
                </p>
                <button
                    onClick={() => window.dispatchEvent(new Event("open-chat"))}
                    className="bg-selva-esmeralda hover:bg-green-600 text-white text-lg px-12 py-4 rounded-full font-bold transition-all active:scale-[0.97] shadow-xl cursor-pointer"
                >
                    Quiero empezar
                </button>
            </div>
        </section>
    );
}
