"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ValueProposition() {
    return (
        <section className="py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="font-serif text-5xl md:text-6xl font-bold text-volcano-black mb-8 leading-tight">
                        Una nueva forma <br />
                        <span className="text-selva-esmeralda">de viajar</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Olvídate de las guías aburridas y los planes genéricos. Momotombo Travels combina la inteligencia artificial con el alma de Nicaragua para crear experiencias únicas, diseñadas solo para ti.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-volcano-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                            Empieza ahora
                        </button>
                        <button className="border-2 border-volcano-black text-volcano-black px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors">
                            Explora viajes de otros
                        </button>
                    </div>
                </motion.div>

                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1534777367038-9404f45b869a?q=80&w=2070&auto=format&fit=crop"
                        alt="Viajera feliz en Nicaragua"
                        fill
                        className="object-cover"
                    />
                </motion.div>
            </div>
        </section>
    );
}
