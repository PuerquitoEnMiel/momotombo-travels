"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  MagnifyingGlass,
  MapPin,
  Star,
  Sparkle,
  SlidersHorizontal,
  X,
  ArrowRight,
  Mountains,
  Compass,
  ShieldCheck,
  Tag,
  CheckCircle,
  CurrencyDollar,
  ChatTeardropDots,
  Funnel,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Spinner, EmptyState, Badge, Container } from "@/components/ui";
import { destinationsService, type AiSearchResponse } from "@/services/destinations.service";
import { useToast } from "@/hooks/useToast";
import type { Destination, PriceLevel } from "@/types/destination";
import { cn } from "@/lib/cn";

// Curated high-fidelity photographic mapping for fallback
const CURATED_IMAGE_MAP: Record<string, string> = {
  granada: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsMfMbRNo6KUhT2tZCFGD497qCCDheHUt8cCtokXMQwZa6WW7wXC7VMnO00VhcMAJQTthd2a_5MzuVvNyv2r8lmrn0bkz9rbPeG7f33gT2F-FDdMLpBRQThZSHFT6g6sLSbcG9bbNxeKlVuq0568J31QrBNZ1fO4DXkpi7Q1OAc-keSWDViS5VU6hJHA4j1f3F7yBDKkKgq8mKn3_EgtDQl1VXBPexi4m6pwWwk1hkyjipKn0_FpSeeVinmktD7F3_uA8GLQKA1_mP",
  ometepe: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-YYlE5imGsvK9-jIaJ4oJnxunIVwYL9ZzunZLmGN1ivgyIkXZu1V1M9sFHxwHGskiA3tE6OCT5UVy6OQJdxkhX8aRzcUYG0TvYR3Y52QgyTLNMthgc5wVisCOoTzfp01zyThJRTwwEcCH9axiFBwuov2fX7DDuBghknHZt73A_WBEMrdC1hdtD1n79I-RCtLNcpTafejTr3CMI5kqNGQ-uMzOY2bEJWkNqiDRt-l-Nt2Y7aZC246vLXsWl6pgZoe8q2zRQzK6zDSJ",
  "san-juan-del-sur": "https://lh3.googleusercontent.com/aida-public/AB6AXuDT56L_A76EwQlQFyQsJHyNPS6UUIm2uqD50uVIbaGt5lInzVSv4orDUhTu1m41DBGjE3xaQ_RQr47TpYMN8QuvF_IUe6gPWdvqVO4viNmQAs679iD99D6WNIupbUC23E4XEjcB5MRKxwK66MYNVKydLAZpdYj634PFy1si5Y60E4D4K-Yy9dqi5MJ-bXYPX-TLdJFlVeFDHu5YXTOsQ9FsdbR3E2nRH4uWNU3ru5X7L0C7Vt2BOVEezbQOFWVDNLiCPQS5VCFB9kUA",
  leon: "https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=1200&auto=format&fit=crop",
  "corn-island": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1200&auto=format&fit=crop",
  mombacho: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvNdbvt0IpFvZ8JMUEhE3ohn0fW_NOAqWe49Ss-QQMuNpskgTzbUmbHuBd23_xO35tWRHO66XW_Fn1tlz1prz2VbN3A-Q0wwku8oRpNpVuG8ODSw2dkZr-ywa_1NojVkLpEdGs9JQ2YXnPSpPtXBhEvyx1yj8BZTZEhNGJrftKS1ShvNWqmQrhURIggLJ5BjipOdyUoGhcmxZ3O-kT6RDqB1o9mx2oxccmjyAJ6wZFAnBMGqo6TbPjltUuHtzee0DCT2b3UEGFpQ0E",
  "cerro-negro": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
  masaya: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
};

const CATEGORY_TABS = [
  { label: "Todas las Expediciones", slug: "" },
  { label: "Volcanes & Aventura", slug: "volcanes" },
  { label: "Ciudades Coloniales", slug: "colonial" },
  { label: "Playas & Surf Pacífico", slug: "playas" },
  { label: "Selva Nubosa & Reservas", slug: "naturaleza" },
];

function getPriceSymbol(level?: string | null): string {
  switch (level?.toUpperCase()) {
    case "LUXURY":
      return "$$$$";
    case "HIGH":
      return "$$$";
    case "MEDIUM":
      return "$$";
    default:
      return "$";
  }
}

function getDestinationImage(dest: Destination): string {
  const hero = dest.images?.find((i) => i.isHero) ?? dest.images?.[0];
  if (hero?.url && !hero.url.includes("placehold.co") && !hero.url.includes("via.placeholder")) {
    return hero.url;
  }
  return CURATED_IMAGE_MAP[dest.slug] || "https://images.unsplash.com/photo-1580610447943-1bfbef5efe07?q=80&w=1200&auto=format&fit=crop";
}

function DestinationCard({ dest, index }: { dest: Destination; index: number }) {
  const imageUrl = getDestinationImage(dest);
  const priceSymbol = getPriceSymbol(dest.priceLevel);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      className="group"
    >
      <Link href={`/explorar/${dest.slug}`} id={`dest-card-${dest.slug}`} className="block h-full">
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ease-out-expo border border-outline-variant/40 hover:border-primary/40 flex flex-col h-full">
          {/* 16:9 Image container with badges */}
          <div className="relative h-64 overflow-hidden bg-surface-container">
            <Image
              src={imageUrl}
              alt={dest.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-linear-to-t from-volcano-black/80 via-volcano-black/20 to-transparent" />

            {/* Top Tag Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-sans font-bold text-[10px] tracking-wider uppercase shadow-xs">
                {dest.category?.name || "Expedición"}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-volcano-black/70 backdrop-blur-md text-oro-indigena font-mono font-bold text-xs shadow-xs">
                {priceSymbol}
              </span>
            </div>

            {/* Bottom Meta Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
              <span className="inline-flex items-center gap-1 font-sans">
                <MapPin size={13} className="text-oro-indigena" weight="fill" />
                Nicaragua
              </span>
              <div className="inline-flex items-center gap-1 font-mono font-bold text-oro-indigena bg-volcano-black/60 px-2 py-0.5 rounded-md">
                <Star size={13} weight="fill" />
                <span>{dest.rating?.toFixed(1) ?? "5.0"}</span>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="p-6 flex flex-col flex-1 justify-between bg-surface-container-lowest">
            <div>
              <h3 className="font-serif text-2xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors leading-snug">
                {dest.name}
              </h3>
              <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed mb-4">
                {dest.description}
              </p>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs">
              <span className="font-mono text-tertiary font-semibold uppercase tracking-wider text-[11px]">
                Guía Certificado
              </span>
              <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-primary group-hover:translate-x-1 transition-transform">
                Explorar Ficha <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function ExplorarPage() {
  const { t } = useTranslation("explore");
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [priceFilter, setPriceFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("RATING");
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
      toast.error("Error al procesar la búsqueda inteligente");
      setSummary("No se pudo completar la búsqueda asistida por IA en este momento.");
    } finally {
      setAiLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSummary(null);
    void loadDestinations(activeCategory || undefined);
  };

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        if (priceFilter === "ALL") return true;
        return dest.priceLevel === priceFilter;
      })
      .sort((a, b) => {
        if (sortBy === "RATING") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "NAME") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [destinations, priceFilter, sortBy]);

  return (
    <main className="min-h-screen bg-background text-on-background selection:bg-oro-indigena selection:text-volcano-black">
      {/* Editorial Luxury Header (Volcanic Elegance from Stitch) */}
      <header className="relative pt-32 pb-20 px-6 bg-volcano-black text-white overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 40%, rgba(201,169,0,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 60%, rgba(138,56,36,0.5) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto text-center space-y-4"
        >
          <span className="font-sans font-semibold text-xs tracking-[0.2em] text-oro-indigena uppercase inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-xs">
            <Sparkle size={13} weight="fill" className="text-oro-indigena" />
            <span>CATÁLOGO DE EXPEDICIONES · ARCHIPIÉLAGO Y VOLCANES</span>
            <span className="text-white/30">·</span>
            <span className="font-mono text-[11px] text-gray-400 lowercase">{"12°29'N 86°32'W"}</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight text-balance">
            Explora los Santuarios Naturales de Nicaragua
          </h1>

          <p className="font-sans text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed text-pretty">
            Expediciones personalizadas de alto nivel que fusionan la majestuosidad de los volcanes activos con el confort colonial y santuarios de bosque nuboso.
          </p>

          {/* AI Search Bar */}
          <form onSubmit={handleAiSearch} className="pt-4 max-w-2xl mx-auto" role="search">
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-full border border-white/20 p-2 hover:border-oro-indigena/50 transition-colors shadow-2xl">
              <Sparkle size={20} className="ml-4 text-oro-indigena shrink-0" aria-hidden="true" />
              <input
                type="text"
                id="ai-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por volcán, ciudad colonial, reserva o actividad..."
                className="flex-1 bg-transparent border-none outline-hidden text-white placeholder-gray-400 text-sm sm:text-base px-3"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-white transition-colors mr-2 cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="submit"
                id="ai-search-submit"
                disabled={aiLoading || !query.trim()}
                className="bg-primary hover:bg-primary-hover text-on-primary px-6 py-3 rounded-full font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 disabled:opacity-50 active:scale-[0.97] cursor-pointer shadow-md"
              >
                {aiLoading ? <Spinner size="sm" /> : <MagnifyingGlass size={16} aria-hidden="true" />}
                <span>Buscar</span>
              </button>
            </div>
          </form>
        </motion.div>
      </header>

      {/* Main Container */}
      <Container size="lg" className="py-12">
        {/* Category Tabs & Controls Bar */}
        <div className="space-y-6 mb-10">
          {/* Category Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORY_TABS.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  id={`category-pill-${cat.slug || "all"}`}
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    setQuery("");
                    setSummary(null);
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-full font-sans font-semibold text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-300 border cursor-pointer active:scale-[0.97]",
                    isActive
                      ? "bg-primary text-on-primary border-primary shadow-md"
                      : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls Bar */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/50 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
            <div className="flex flex-wrap items-center gap-4">
              {/* Price Level Dropdown */}
              <div className="flex items-center gap-2">
                <Tag size={15} className="text-tertiary" />
                <span className="font-semibold text-on-surface-variant uppercase tracking-wider text-[11px]">
                  Presupuesto:
                </span>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 text-on-surface font-medium focus:outline-hidden focus:border-primary cursor-pointer"
                >
                  <option value="ALL">Todos los Rangos</option>
                  <option value="LOW">Económico ($)</option>
                  <option value="MEDIUM">Estándar ($$)</option>
                  <option value="HIGH">Premium ($$$)</option>
                  <option value="LUXURY">Lujo Exclusivo ($$$$)</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-tertiary" />
                <span className="font-semibold text-on-surface-variant uppercase tracking-wider text-[11px]">
                  Ordenar:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 text-on-surface font-medium focus:outline-hidden focus:border-primary cursor-pointer"
                >
                  <option value="RATING">Mejor Calificados</option>
                  <option value="NAME">Nombre Alfabético</option>
                </select>
              </div>
            </div>

            {/* Live Count Badge */}
            <div className="flex items-center gap-2 text-on-surface-variant font-mono">
              <span className="w-2 h-2 rounded-full bg-selva-esmeralda animate-pulse" />
              <span>
                <strong className="text-on-surface">{filteredDestinations.length}</strong> Destinos Verificados
              </span>
            </div>
          </div>
        </div>

        {/* AI Search Summary Banner */}
        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex gap-4 backdrop-blur-xs"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkle size={20} weight="fill" />
              </div>
              <div>
                <p className="font-serif font-bold text-on-surface mb-1">Curaduría Kary IA:</p>
                <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Destination Cards Grid */}
        {(loading || aiLoading) && (
          <div className="flex flex-col items-center justify-center py-24" role="status">
            <Spinner size="xl" className="mb-4" />
            <p className="text-on-surface-variant font-mono text-xs uppercase tracking-wider animate-pulse">
              {aiLoading ? "Consultando a Kary IA..." : "Sincronizando santuarios de Nicaragua..."}
            </p>
          </div>
        )}

        {!loading && !aiLoading && (
          <>
            {filteredDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {filteredDestinations.map((dest, i) => (
                  <DestinationCard key={dest.id} dest={dest} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-8 mb-16">
                <MapPin size={40} className="text-stone-400 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-on-surface mb-1">No se encontraron destinos</h3>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">
                  Prueba modificando tus filtros de categoría o presupuesto para ver más expediciones.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("");
                    setPriceFilter("ALL");
                    clearSearch();
                  }}
                  className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-sans text-xs font-semibold uppercase tracking-wider"
                >
                  Restablecer Filtros
                </button>
              </div>
            )}
          </>
        )}

        {/* AI Expedition Curator Spotlight (from Stitch Design) */}
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-8 sm:p-12 shadow-xl mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-tertiary font-bold flex items-center gap-1.5">
                <Sparkle size={15} weight="fill" /> ASISTENCIA VIRTUAL · KARY IA
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
                ¿Indeciso sobre cuál elegir?
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-xl">
                Conversa con Kary IA para filtrar las expediciones de acuerdo con tu nivel de resistencia física, ventanas climáticas en los volcanes y preferencias exclusivas de descanso.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                href="/planificar"
                id="btn-explorar-plan-ai"
                className="px-6 py-3.5 rounded-xl bg-primary text-on-primary font-sans font-semibold text-xs tracking-wider uppercase text-center shadow-md hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
              >
                <Sparkle size={16} weight="fill" className="text-oro-indigena" />
                Diseñar con Kary IA
              </Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-chat"))}
                id="btn-explorar-open-chat"
                className="px-6 py-3.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface font-sans font-semibold text-xs tracking-wider uppercase text-center hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
              >
                <ChatTeardropDots size={16} />
                Chat Rápido
              </button>
            </div>
          </div>
        </div>

        {/* Trust & Operator Accreditation Pillars (from Stitch Design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-outline-variant/30">
          <div className="flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <ShieldCheck size={18} weight="fill" />
            </div>
            <div>
              <p className="font-bold text-on-surface">Vulcanólogos INETER</p>
              <p className="text-on-surface-variant text-[11px]">Guías acreditados y monitoreo activo</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
              <Sparkle size={18} weight="fill" />
            </div>
            <div>
              <p className="font-bold text-on-surface">Curaduría IA & Humana</p>
              <p className="text-on-surface-variant text-[11px]">Respaldo 24/7 en expediciones</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Star size={18} weight="fill" />
            </div>
            <div>
              <p className="font-bold text-on-surface">Relais & Châteaux</p>
              <p className="text-on-surface-variant text-[11px]">Hospedaje colonial & eco-luxury</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <CheckCircle size={18} weight="fill" />
            </div>
            <div>
              <p className="font-bold text-on-surface">Cero Plásticos</p>
              <p className="text-on-surface-variant text-[11px]">Compromiso 100% carbono neutro</p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
