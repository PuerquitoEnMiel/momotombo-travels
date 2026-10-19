"use client";

import { Container, Input, Button } from "@/components/ui";

export function Newsletter() {
  return (
    <section className="py-24 px-6 bg-surface-container-low/40 border-t border-outline-variant/30">
      <Container size="md" className="text-center">
        <span className="font-sans font-bold text-xs text-tertiary-text uppercase tracking-widest block mb-2">
          BOLETÍN EDITORIAL
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-on-surface mb-4 text-balance">
          Crónicas de los Maribios
        </h2>
        <p className="text-on-surface-variant mb-10 text-base md:text-lg text-pretty max-w-xl mx-auto leading-relaxed">
          Disquisiciones mensuales sobre lagunas secretas, haciendas cafetaleras centenarias y novedades geológicas del arco volcánico centroamericano.
        </p>

        {/* Subscription endpoint does not exist yet: the form is clearly marked
            "Próximamente" and disabled so it never pretends to send data. */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <Input
            type="email"
            value=""
            onChange={() => {}}
            placeholder="correo@ejemplo.com"
            id="newsletter-email-input"
            autoComplete="email"
            disabled
            containerClassName="flex-1"
            className="rounded-lg! h-12! bg-surface-container-lowest!"
          />
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled
            id="newsletter-submit-button"
            className="rounded-lg! h-12! shadow-sm hover:shadow-md px-6 font-sans font-semibold text-xs tracking-wider uppercase whitespace-nowrap"
          >
            Próximamente
          </Button>
        </form>

        <p className="mt-5 text-xs text-on-surface-variant">
          Próximamente: las suscripciones al boletín aún no están disponibles. Tu correo no se envía ni se almacena.
        </p>
      </Container>
    </section>
  );
}
