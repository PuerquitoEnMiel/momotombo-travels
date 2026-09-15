"use client";

import { motion } from "framer-motion";

export function Manifesto() {
  return (
    <section className="py-28 px-8 bg-surface-container-low/40 relative overflow-hidden text-center border-t border-outline-variant/40" id="filosofia">
      <div className="max-w-4xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-sans font-bold text-xs text-tertiary uppercase tracking-widest block mb-4"
        >
          TURISMO REGENERATIVO & HERENCIA VOLCÁNICA
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-serif text-3xl md:text-5xl font-bold text-on-surface italic mb-8 leading-snug text-balance"
        >
          &ldquo;Nicaragua no se visita de prisa; se siente en el eco de sus campanas coloniales y en el pulso silencioso de sus volcanes dormidos.&rdquo;
        </motion.h2>

        <div className="w-16 h-0.5 bg-tertiary mx-auto mb-8 opacity-60" />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-sans text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-10 text-pretty"
        >
          En Momotombo creemos que el lujo auténtico radica en la lentitud de la mirada, en la sabiduría de las comunidades que custodian las laderas de magma y en la conservación estricta de las cuencas de agua dulce que alimentan nuestro territorio.
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-on-surface font-sans text-xs font-semibold tracking-wider">
          <span className="text-secondary">HOSPITALIDAD CONSCIENTE</span>
          <span className="text-outline-variant">•</span>
          <span className="text-secondary">CERO PLÁSTICOS DE UN SOLO USO</span>
          <span className="text-outline-variant">•</span>
          <span className="text-secondary">RETORNO DIRECTO A PARQUES NACIONALES</span>
        </div>
      </div>
    </section>
  );
}
