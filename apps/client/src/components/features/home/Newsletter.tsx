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
    <section className="py-24 px-6 bg-surface-container-lowest">
      <Container size="md" className="text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-volcano-black mb-6 text-balance">
          {t("title")} <br />
          <span className="text-primary">{t("titleAccent")}</span>
        </h2>
        <p className="text-on-surface-variant mb-10 text-lg text-pretty max-w-2xl mx-auto">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            id="newsletter-email-input"
            autoComplete="email"
            containerClassName="flex-1"
            className="!rounded-full !h-14"
          />
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={loading}
            id="newsletter-submit-button"
            className="!rounded-full shadow-md hover:shadow-lg"
          >
            {t("submit")}
          </Button>
        </form>

        <p className="mt-6 text-xs text-on-surface-variant">{t("terms")}</p>
      </Container>
    </section>
  );
}
