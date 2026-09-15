"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Container, Input, Button } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

export function Newsletter() {
  const { t } = useTranslation("home", { keyPrefix: "newsletter" });
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulated request — replace with real endpoint when available
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success(t("success"));
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-24 px-6 bg-surface-container-low/40 border-t border-outline-variant/30">
      <Container size="md" className="text-center">
        <span className="font-sans font-bold text-xs text-tertiary uppercase tracking-widest block mb-2">
          BOLETÍN EDITORIAL
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-on-surface mb-4 text-balance">
          Crónicas de los Maribios
        </h2>
        <p className="text-on-surface-variant mb-10 text-base md:text-lg text-pretty max-w-xl mx-auto leading-relaxed">
          Disquisiciones mensuales sobre lagunas secretas, haciendas cafetaleras centenarias y novedades geológicas del arco volcánico centroamericano.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            id="newsletter-email-input"
            autoComplete="email"
            containerClassName="flex-1"
            className="!rounded-lg !h-12 !bg-surface-container-lowest"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            id="newsletter-submit-button"
            className="!rounded-lg !h-12 shadow-sm hover:shadow-md px-6 font-sans font-semibold text-xs tracking-wider uppercase whitespace-nowrap"
          >
            Suscribirme a las Crónicas
          </Button>
        </form>

        <p className="mt-5 text-xs text-on-surface-variant">Respetamos el silencio. Cancelación en un clic en cada entrega.</p>
      </Container>
    </section>
  );
}
