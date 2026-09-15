"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MagnifyingGlass, MapPin, Star, Sparkle, Sliders, X, ArrowRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Spinner, EmptyState, Badge, Container } from "@/components/ui";
import { destinationsService, type AiSearchResponse } from "@/services/destinations.service";
import { useToast } from "@/hooks/useToast";
import type { Destination, PriceLevel } from "@/types/destination";
import { cn } from "@/lib/cn";


const PRICE_LABELS_KEY: Record<PriceLevel, string> = {
  FREE: "priceLabels.FREE",
  LOW: "priceLabels.LOW",
  MEDIUM: "priceLabels.MEDIUM",
  HIGH: "priceLabels.HIGH",
  LUXURY: "priceLabels.LUXURY",
};

const CATEGORY_KEYS = [
  { key: "all", slug: "" },
  { key: "volcanoes", slug: "volcanes" },
  { key: "colonial", slug: "colonial" },
  { key: "beaches", slug: "playas" },
  { key: "islands", slug: "islas" },
];

function DestinationCard({ dest, index }: { dest: Destination; index: number }) {
  const { t } = useTranslation("explore");
  const hero = dest.images?.find((i) => i.isHero) ?? dest.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
      className="group active:scale-[0.97] transition-transform duration-300 ease-out-expo"
    >
      <Link href={`/explorar/${dest.slug}`} id={`dest-card-${dest.slug}`}>
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ease-out-expo border border-outline-variant/30 hover:border-primary/20">
          <div className="relative h-64 overflow-hidden bg-surface-container">
            {hero ? (
              <Image
                src={hero.url}
                alt={dest.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out-expo"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-5xl">🏔️</div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            <div className="absolute top-4 left-4">
              <Badge variant="default" size="sm" className="bg-surface-container-lowest/90! text-volcano-black!">
                {dest.category?.name}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="primary" size="sm">
                {t(PRICE_LABELS_KEY[dest.priceLevel] as never) || dest.priceLevel}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span className="bg-surface-container-lowest text-volcano-black px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                {t("results.viewDestination")} <ArrowRight size={14} aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-serif text-2xl font-bold text-volcano-black mb-2 group-hover:text-primary transition-colors text-balance">
              {dest.name}
            </h3>
            <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed text-pretty">
              {dest.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star size={15} className="text-oro-indigena fill-oro-indigena" weight="fill" />
                <span className="text-sm font-bold text-on-surface">{dest.rating?.toFixed(1) ?? "—"}</span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                <MapPin size={12} aria-hidden="true" />
                <span>Nicaragua</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ExplorarPage() {
  const { t } = useTranslation("explore");
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [summary, setSummary] = useState<string | null>(null);

  const loadDestinations = useCallback(async (catSlug?: string) => {
    setLoading(true);
    setSummary(null);
    try {
      const data = await destinationsService.list(catSlug);
      setDestinations(Array.isArray(data) ? data : []);
    } catch {
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDestinations(activeCategory || undefined);
  }, [activeCategory, loadDestinations]);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setAiLoading(true);
    setSummary(null);
    try {
      const data: AiSearchResponse = await destinationsService.aiSearch(query);
      setDestinations(data.destinations || []);
      setSummary(data.summary || null);
    } catch {
      toast.error(t("ai.error"));
      setSummary(t("ai.error"));
    } finally {
      setAiLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSummary(null);
    void loadDestinations(activeCategory || undefined);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-surface-container-low via-surface-container-lowest to-info-container/30">
      <header className="relative pt-32 pb-16 px-6 text-center bg-volcano-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, rgba(0,71,186,0.8) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(0,128,85,0.8) 0%, transparent 50%)" }}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span className="text-oro-indigena text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
            {t("header.badge")}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-nica-white mb-4 leading-tight text-balance">
            {t("header.title")}<br />
            <span className="text-oro-indigena">{t("header.titleAccent")}</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 text-pretty">
            {t("header.subtitle")}
          </p>

          <form onSubmit={handleAiSearch} className="relative w-full max-w-2xl mx-auto" role="search">
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-full border border-white/20 p-2 hover:border-oro-indigena/50 transition-colors shadow-2xl">
              <Sparkle size={20} className="ml-4 text-oro-indigena shrink-0" aria-hidden="true" />
              <input
                type="text"
                id="ai-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("header.searchPlaceholder")}
                aria-label={t("header.searchButton")}
                className="flex-1 bg-transparent border-none outline-none text-nica-white placeholder-gray-400 text-base px-4"
              />
              {query && (
                <button type="button" onClick={clearSearch} className="text-gray-400 hover:text-nica-white transition-colors mr-2" aria-label="Limpiar búsqueda">
                  <X size={18} />
                </button>
              )}
              <button
                type="submit"
                id="ai-search-submit"
                disabled={aiLoading || !query.trim()}
                className="bg-primary hover:bg-secondary text-nica-white px-6 py-3 rounded-full font-bold transition-all duration-300 ease-out-expo flex items-center gap-2 disabled:opacity-50 text-sm active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-oro-indigena"
              >
                {aiLoading ? <Spinner size="sm" /> : <MagnifyingGlass size={18} aria-hidden="true" />}
                {t("header.searchButton")}
              </button>
            </div>
          </form>
        </motion.div>
      </header>

      <Container size="lg" className="py-12">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {CATEGORY_KEYS.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.key}
                type="button"
                id={`category-pill-${cat.slug || "all"}`}
                onClick={() => { setActiveCategory(cat.slug); setQuery(""); setSummary(null); }}
                aria-pressed={isActive}
                className={cn(
                  "px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ease-out-expo border active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-primary",
                  isActive
                    ? "bg-primary text-nica-white border-primary shadow-lg shadow-primary/20"
                    : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                )}
              >
                {t(`categories.${cat.key}`)}
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant text-sm font-medium cursor-not-allowed opacity-60">
            <Sliders size={16} aria-hidden="true" />
            {t("header.advancedFilters")}
          </div>
        </div>

        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="bg-linear-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkle size={20} className="text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-on-surface mb-1">{t("ai.recommends")}</p>
                <p className="text-on-surface leading-relaxed whitespace-pre-wrap text-pretty">{summary}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(loading || aiLoading) && (
          <div className="flex flex-col items-center justify-center py-24" role="status" aria-live="polite">
            <Spinner size="xl" className="mb-6" />
            <p className="text-on-surface-variant animate-pulse">
              {aiLoading ? t("ai.loading") : "Cargando destinos..."}
            </p>
          </div>
        )}

        {!loading && !aiLoading && (
          <>
            <p className="text-on-surface-variant text-sm mb-6">
              <span className="font-bold text-on-surface">{destinations.length}</span>{" "}
              {t("results.count", { count: destinations.length }).replace(/^\d+\s/, "").trim()}
            </p>
            {destinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((dest, i) => (
                  <DestinationCard key={dest.id} dest={dest} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MapPin size={28} weight="duotone" />}
                title={t("results.noResults")}
                description={t("results.noResultsHint")}
              />
            )}
          </>
        )}
      </Container>
    </main>
  );
}
