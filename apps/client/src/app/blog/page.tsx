"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/es";
import {
  BookOpen,
  Calendar,
  ArrowRight,
  Sparkle,
  MagnifyingGlass,
  BookmarkSimple,
  Clock,
  MapPin,
  EnvelopeSimple,
  Radio,
  CheckCircle,
} from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/hooks/useToast";
import { blogsService } from "@/services/blogs.service";
import type { BlogPost } from "@/types/blog";

dayjs.locale("es");

const DATE_FORMAT = "D [de] MMMM [de] YYYY";
const ALL_CATEGORY = "Todas las Crónicas";

/** Derived from the real post body (avg 200 wpm). Never fabricated. */
function estimateReadTimeMin(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

interface ExtendedBlogPost extends BlogPost {
  /** Real destination name from the API (post.destination), when present. */
  destinationName?: string;
  readTimeMin: number;
}

export default function BlogPage() {
  const toast = useToast();
  const [posts, setPosts] = useState<ExtendedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recientes" | "lectura">("recientes");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await blogsService.list();
      const mapped: ExtendedBlogPost[] = (data ?? []).map((item) => ({
        ...item,
        destinationName: item.destination?.name,
        readTimeMin: estimateReadTimeMin(item.content ?? ""),
      }));
      setPosts(mapped);
    } catch {
      setPosts([]);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const categories = useMemo(() => {
    const names = Array.from(
      new Set(posts.map((p) => p.destinationName).filter((n): n is string => Boolean(n)))
    );
    return [ALL_CATEGORY, ...names];
  }, [posts]);

  const leadPost = posts[0];
  const gridPosts = useMemo(() => {
    return posts
      .slice(1)
      .filter((post) => {
        const matchesCategory =
          selectedCategory === ALL_CATEGORY || post.destinationName === selectedCategory;

        const matchesSearch =
          !searchQuery.trim() ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.destinationName &&
            post.destinationName.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "recientes") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.readTimeMin - b.readTimeMin;
      });
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    toast.info("Bitácora de expedición actualizada");
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    toast.success("Suscripción registrada en el Despacho Privado de Campo");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8f4] flex items-center justify-center" role="status">
        <Spinner size="xl" />
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-[#fff8f4] text-[#1e1b18] flex items-center justify-center p-6">
        <EmptyState
          icon={<BookOpen size={28} weight="duotone" />}
          title="No pudimos cargar las crónicas"
          description="Revisa tu conexión e inténtalo de nuevo para ver las últimas publicaciones del blog."
          action={{ label: "Reintentar", onClick: () => void loadPosts() }}
        />
      </main>
    );
  }

  if (posts.length === 0 || !leadPost) {
    return (
      <main className="min-h-screen bg-[#fff8f4] text-[#1e1b18] flex items-center justify-center p-6">
        <p className="text-sm text-[#55423e]">Aún no hay crónicas publicadas.</p>
      </main>
    );
  }

  return (
    <div className="bg-[#fff8f4] text-[#1e1b18] font-body-md antialiased selection:bg-[#8a3824] selection:text-white min-h-screen">
      {/* Top Status Banner (Diplomatic Telemetry) */}
      <div className="w-full bg-[#1e1b18] text-[#fff8f4] px-6 lg:px-8 py-2 border-b border-white/10 font-mono text-[11px] tracking-widest flex flex-col sm:flex-row justify-between items-center gap-2 z-50">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-[#c6e7d6]">
            <span className="w-2 h-2 rounded-full bg-[#1e3b2f] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#1e3b2f]" />
            ESTADO TELEMÉTRICO: ACTIVO
          </span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline text-[#e0d9d4]">CUADERNO DE CAMPO · MOMOTOMBO TRAVELS</span>
        </div>
        <div className="flex items-center gap-6 text-[#c49a45]">
          <span className="hidden sm:inline font-mono">12°29&apos;N 86°32&apos;W · MOMOTOMBO 1,297 msnm</span>
          <span className="font-semibold text-white/90">ACCESO VIP DIPLOMÁTICO REGISTRADO</span>
        </div>
      </div>

      {/* Editorial Masthead Banner */}
      <header className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-10 pb-6 border-b border-[#dbc1bb]/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#faf2ed] border border-[#c49a45]/30 text-[#8a3824] font-mono text-[11px] tracking-widest uppercase font-semibold mb-3">
              <BookOpen size={14} />
              <span>CUADERNO DE CAMPO · EDICIÓN VOLCÁNICA OTOÑO 2026</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1e1b18] font-bold tracking-tight">
              Crónicas de Fuego, Selva y Piedra Colonial
            </h1>
          </div>
          <div className="text-left md:text-right pb-1">
            <p className="font-mono text-xs text-text-muted tracking-widest uppercase">
              REGISTRO GEOLÓGICO Y CULTURAL
            </p>
            <p className="text-xs text-[#55423e] mt-0.5">
              Archivos de Campo Vol. IX · Curaduría Editorial
            </p>
          </div>
        </div>
      </header>

      {/* SECTION 2: HERO EDITORIAL DISPATCH (Lead Story Asymmetric Spread) */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Cinematic Visual & Overlay */}
          <div className="lg:col-span-7 relative min-h-[460px] sm:min-h-[520px] rounded-xl overflow-hidden shadow-md border border-[#dbc1bb]/60 group">
            <Image
              src={leadPost.coverImage}
              alt={leadPost.title}
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b18] via-[#1e1b18]/40 to-transparent" />

            {/* Badges */}
            <div className="absolute top-6 left-6 right-6 flex flex-wrap justify-between items-center gap-2">
              <span className="px-3 py-1 bg-[#8a3824] text-white font-mono text-xs uppercase tracking-widest font-semibold rounded">
                DESPACHO DESTACADO
              </span>
              {leadPost.destinationName && (
                <span className="px-3 py-1 bg-[#fff8f4]/90 backdrop-blur-md text-[#8a3824] font-mono text-xs uppercase tracking-widest font-bold rounded border border-[#dbc1bb]">
                  {leadPost.destinationName}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Floating Travertine Narrative Block */}
          <div className="lg:col-span-5 bg-white border border-[#dbc1bb]/60 rounded-xl p-8 sm:p-10 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-muted mb-4">
                {leadPost.destinationName && (
                  <>
                    <span className="text-[#8a3824] font-bold uppercase">{leadPost.destinationName}</span>
                    <span>·</span>
                  </>
                )}
                <span>{dayjs(leadPost.createdAt).format(DATE_FORMAT)}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 text-[#55423e]">
                  <Clock size={14} /> {leadPost.readTimeMin} min de lectura
                </span>
              </div>

              <Link href={`/blog/${leadPost.slug}`} className="group">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1e1b18] font-bold leading-tight mb-4 group-hover:text-[#8a3824] transition-colors">
                  {leadPost.title}
                </h2>
              </Link>

              <p className="text-sm text-[#55423e] leading-relaxed mb-6">
                {leadPost.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-[#dbc1bb]/40">
              <div className="flex items-center gap-3">
                <Link
                  href={`/blog/${leadPost.slug}`}
                  id="btn-read-lead-article"
                  aria-label={`Leer artículo: ${leadPost.title}`}
                  className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-[#8a3824] hover:bg-[#6c2210] text-[#fff8f4] font-mono text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm hover:shadow transition-all"
                >
                  <span>Leer Crónica Completa</span>
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleBookmark(leadPost.id)}
                  aria-label="Guardar en Bitácora"
                  className={`p-3.5 border rounded-lg transition-colors cursor-pointer ${
                    bookmarkedIds.includes(leadPost.id)
                      ? "bg-[#c6e7d6] border-[#1e3b2f] text-[#1e3b2f]"
                      : "bg-[#fff8f4] border-[#dbc1bb] text-[#55423e] hover:border-[#8a3824] hover:text-[#8a3824]"
                  }`}
                >
                  <BookmarkSimple size={18} weight={bookmarkedIds.includes(leadPost.id) ? "fill" : "regular"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Concierge Banner */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-8 mb-10">
        <div className="bg-gradient-to-r from-[#8a3824] to-[#1e3b2f] rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 md:flex items-center justify-between gap-8">
            <div className="md:max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkle size={18} className="text-[#c49a45]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#c49a45] font-bold">
                  CONCIERGE DE EXPEDICIÓN AI
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
                ¿Desea explorar un rincón específico de la geografía nicaragüense?
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Consulte a Kary, nuestro Concierge de Viajes entrenado con información de destinos, rutas y cultura de Nicaragua.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new Event("open-chat"));
                toast.info("Kary está a su disposición.");
              }}
              id="btn-open-ai-concierge-blog"
              className="mt-6 md:mt-0 px-8 py-4 bg-white text-[#1e1b18] hover:bg-[#fff8f4] hover:text-[#8a3824] rounded-lg font-mono text-xs uppercase tracking-widest font-bold shadow-md flex items-center gap-3 transition-all shrink-0 cursor-pointer"
            >
              <Sparkle size={18} className="text-[#8a3824]" />
              <span>Consultar al Concierge</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: FILTER & THEMATIC CATEGORIES STRIP */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-8 py-4">
        <div className="bg-[#faf2ed] border border-[#dbc1bb]/60 p-4 rounded-xl flex flex-col xl:flex-row items-center justify-between gap-4">
          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
            {categories.map((cat) => {
              const count =
                cat === ALL_CATEGORY
                  ? posts.length
                  : posts.filter((p) => p.destinationName === cat).length;

              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-xs tracking-wider rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1e3b2f] text-white shadow-xs font-semibold"
                      : "bg-white text-[#55423e] hover:text-[#8a3824] hover:bg-[#eee7e2] border border-[#dbc1bb]/60"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isSelected ? "bg-[#c6e7d6] text-[#1e3b2f]" : "bg-[#f4ece7] text-[#55423e]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
            <div className="relative flex-1 sm:w-64">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por cordillera o palabra..."
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white border border-[#dbc1bb] rounded-lg text-[#1e1b18] placeholder:text-text-muted/70 focus:outline-none focus:border-[#8a3824]"
              />
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted border border-[#dbc1bb] px-3 py-2 bg-white rounded-lg">
              <span>Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Ordenar crónicas"
                className="bg-transparent border-0 text-[#1e1b18] font-bold text-xs p-0 focus:ring-0 cursor-pointer outline-none"
              >
                <option value="recientes">Más Recientes</option>
                <option value="lectura">Tiempo Lectura</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: EDITORIAL CHRONICLES GRID */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
        {gridPosts.length === 0 ? (
          <div className="bg-white border border-[#dbc1bb]/60 rounded-xl p-12 text-center space-y-4">
            <BookOpen size={48} className="text-text-muted mx-auto opacity-40" />
            <h3 className="font-serif text-xl font-bold text-[#1e1b18]">No se encontraron crónicas en esta sección</h3>
            <p className="text-xs text-[#55423e]">Pruebe seleccionando otra categoría o limpiando su búsqueda.</p>
            <button
              onClick={() => {
                setSelectedCategory(ALL_CATEGORY);
                setSearchQuery("");
              }}
              className="px-5 py-2.5 bg-[#8a3824] text-white font-mono text-xs uppercase tracking-widest font-semibold rounded-lg"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-[#dbc1bb]/60 rounded-xl flex flex-col justify-between group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#e0d9d4]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {post.destinationName && (
                      <div className="absolute top-4 left-4">
                        <span className="px-2.5 py-1 bg-[#fff8f4]/95 text-[#8a3824] border border-[#c49a45]/40 font-mono text-[10px] font-bold uppercase tracking-wider rounded">
                          {post.destinationName}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleBookmark(post.id)}
                      aria-label="Marcar crónica"
                      className="absolute top-4 right-4 p-2 bg-[#fff8f4]/90 rounded-full text-[#55423e] hover:text-[#8a3824] transition-colors"
                    >
                      <BookmarkSimple size={16} weight={bookmarkedIds.includes(post.id) ? "fill" : "regular"} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-text-muted mb-2">
                      <Calendar size={13} />
                      <span>{dayjs(post.createdAt).format(DATE_FORMAT)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {post.readTimeMin} min de lectura
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="group">
                      <h3 className="font-serif text-xl font-bold text-[#1e1b18] mb-2 leading-snug group-hover:text-[#8a3824] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    {post.destinationName && (
                      <div className="flex items-center gap-1 text-[11px] text-[#8a3824] font-mono mb-3">
                        <MapPin size={13} />
                        <span>{post.destinationName}</span>
                      </div>
                    )}

                    <p className="text-xs text-[#55423e] leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-[#dbc1bb]/30 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    id={`link-read-article-${post.slug}`}
                    aria-label={`Leer artículo: ${post.title}`}
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold text-[#8a3824] hover:text-[#6c2210] transition-colors"
                  >
                    <span>Leer Crónica</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5: NEWSLETTER & FIELD DISPATCH ENCLAVE */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-8 py-12">
        <div className="bg-[#1e1b18] border border-[#c49a45]/30 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-[#c49a45]/40 text-[#c49a45] font-mono text-[10px] tracking-widest uppercase rounded-full">
              <Radio size={14} />
              <span>BOLETÍN CIENTÍFICO Y DE EXPLORACIÓN</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Suscripción al Despacho Privado de Campo
            </h2>

            <p className="text-sm text-white/80 leading-relaxed max-w-xl mx-auto">
              Reciba mensualmente análisis geofísicos, guías de expedición inéditas y accesos prioritarios a rutas restringidas de la Cordillera de los Maribios.
            </p>

            {newsletterSuccess ? (
              <div className="p-4 bg-[#1e3b2f]/60 border border-[#c6e7d6]/40 rounded-xl flex items-center justify-center gap-3 text-[#c6e7d6] text-xs font-mono">
                <CheckCircle size={18} weight="fill" />
                <span>Expediente de suscripción validado. Recibirá el próximo despacho en su terminal.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="expedicionario@cordillera.ni"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 font-mono text-xs focus:outline-none focus:border-[#c49a45]"
                  />
                </div>
                <button
                  type="submit"
                  id="btn-subscribe-newsletter"
                  className="px-6 py-3 bg-[#8a3824] hover:bg-[#6c2210] text-[#fff8f4] font-mono text-xs uppercase tracking-widest font-bold rounded-lg shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  Suscribirse al Despacho
                </button>
              </form>
            )}

            <p className="font-mono text-[10px] text-white/40 pt-2">
              Conexión Cifrada · Cero Spam · Cancela Cuando Quiera
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: CONFIDENTIAL DIPLOMATIC FOOTER */}
      <footer className="w-full bg-[#eee7e2] border-t border-[#dbc1bb]/50 py-8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-[#dbc1bb]/40 font-mono text-xs tracking-wider uppercase text-text-muted">
            <div className="flex items-center gap-2">
              <span className="text-[#8a3824] font-bold">24/7 CONCIERGE HOTLINE:</span>
              <strong className="text-[#1e1b18]">+505 2249-2760</strong>
            </div>
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-[#1e3b2f]" />
              <span>COMUNICACIÓN SATELITAL DE RESPALDO · PROTOCOLO DE CONTINGENCIA</span>
            </div>
            <div className="flex items-center gap-2 text-[#c49a45]">
              <span>OPERACIÓN CON GUÍAS LOCALES EXPERIMENTADOS</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#55423e]">
            <div>© 2026 Momotombo Travels. Todos los derechos reservados.</div>
            <nav className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px]">
              <Link href="/terminos" className="hover:text-[#8a3824] transition-colors">
                Términos y Condiciones
              </Link>
              <span className="text-[#dbc1bb]">·</span>
              <Link href="/privacidad" className="hover:text-[#8a3824] transition-colors">
                Política de Privacidad
              </Link>
              <span className="text-[#dbc1bb]">·</span>
              <Link href="/institucional/contacto" className="hover:text-[#8a3824] transition-colors">
                Contacto
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
