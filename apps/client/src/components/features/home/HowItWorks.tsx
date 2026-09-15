"use client";

import { motion } from "framer-motion";
import { ChatTeardropDots, SlidersHorizontal, ShieldCheck } from "@phosphor-icons/react";

const MOMENTS = [
  {
    step: "01",
    icon: <ChatTeardropDots size={28} weight="fill" className="text-primary" />,
    title: "Conversa con Kary",
    description: "Comparte tus intereses: apetito de adrenalina volcánica, fechas deseadas, preferencias gastronómicas y estilo de descanso. Nuestra IA procesa cientos de variables climatológicas y topográficas en segundos.",
    meta: "TIEMPO ESTIMADO: 4 MINUTOS"
  },
  {
    step: "02",
    icon: <SlidersHorizontal size={28} weight="fill" className="text-secondary" />,
    title: "Curaduría a Medida",
    description: "Recibe un dossier editorial interactivo con rutas minuciosamente sincronizadas: reservas en haciendas exclusivas, traslados helicóptero/charter y acceso con guías vulcanólogos locales.",
    meta: "REVISIÓN HUMANA 100% GARANTIZADA"
  },
  {
    step: "03",
    icon: <ShieldCheck size={28} weight="fill" className="text-tertiary" />,
    title: "Expedición Impecable",
    description: "Desde tu llegada a pista hasta tu último café en los miradores del Mombacho, cuentas con asistencia continua 24/7 de nuestro equipo concierge en tierra y seguimiento de satélite en tiempo real.",
    meta: "SEGURIDAD & PRIVACIDAD TOTAL"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 md:px-12 bg-surface-container-low/60 border-y border-outline-variant/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="font-sans font-bold text-xs text-tertiary uppercase tracking-widest block mb-2">
            MÉTODO MOMOTOMBO
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-on-surface tracking-tight">
            Tu Viaje en Tres Momentos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOMENTS.map((item, index) => (
            <motion.article
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 relative flex flex-col justify-between shadow-xs hover:shadow-lg transition-all"
            >
              <span className="text-6xl font-serif text-outline-variant/30 font-bold absolute top-6 right-6 select-none pointer-events-none">
                {item.step}
              </span>
              <div>
                <div className="w-14 h-14 rounded-xl bg-surface-container-high/60 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold text-on-surface mb-3">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-outline-variant/30 font-mono text-[10px] text-tertiary font-bold tracking-wider">
                {item.meta}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
