"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/es";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ShareNetwork,
  BookmarkSimple,
  Copy,
  FileText,
  ShieldCheck,
  Compass,
  ArrowRight,
} from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { sanitizeHtml } from "@/lib/sanitize";
import { useToast } from "@/hooks/useToast";
import { blogsService } from "@/services/blogs.service";
import type { BlogPost } from "@/types/blog";

dayjs.locale("es");

interface ExtendedPost extends BlogPost {
  category?: string;
  location?: string;
  readTime?: string;
  author?: { name?: string };
}

function estimateReadTime(html: string): string {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de lectura`;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const toast = useToast();

  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError(true);
      return;
    }
    let cancelled = false;

    setLoading(true);
    setError(false);

    (async () => {
      try {
        const data = await blogsService.getBySlug(slug);
        if (cancelled) return;
        if (data) {
          setPost(data);
        } else {
          setPost(null);
          setError(true);
        }
      } catch {
        if (!cancelled) {
          setPost(null);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  const handleRetry = () => {
    setError(false);
    setAttempt((a) => a + 1);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = post?.title || "Crónica de Expedición — Momotombo Travels";
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        /* cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace oficial copiado al portapapeles");
    }
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.info(!bookmarked ? "Crónica guardada en su bitácora" : "Crónica retirada de la bitácora");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center pt-24" role="status">
        <Spinner size="xl" />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState
            icon={<FileText size={28} />}
            title="Crónica no disponible"
            description="No pudimos cargar esta publicación. Es posible que haya sido movida o eliminada del Cuaderno de Campo."
            action={{ label: "Reintentar", onClick: handleRetry }}
            secondaryAction={{
              label: "Volver al blog",
              onClick: () => (window.location.href = "/blog"),
            }}
          />
        </div>
      </main>
    );
  }

  const authorName = post.author?.name?.trim() || "Momotombo Travels";
  const authorInitials = authorName
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const readTime = post.readTime || estimateReadTime(post.content || "");

  return (
    <div className="bg-background text-[#1e1b18] font-body-md antialiased selection:bg-[#8a3824] selection:text-white min-h-screen">
      {/* Editorial Status Bar */}
      <div className="w-full bg-[#1e1b18] text-[#fff8f4] px-6 lg:px-8 py-2 border-b border-white/10 font-mono text-[11px] tracking-widest flex flex-col sm:flex-row justify-between items-center gap-2 z-50">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-[#c6e7d6]">
            <span className="w-2 h-2 rounded-full bg-[#1e3b2f] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#1e3b2f]" />
            CUADERNO DE CAMPO · MOMOTOMBO TRAVELS
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#c49a45]">
          <span>{(post.destination?.name || "NICARAGUA").toUpperCase()}</span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-white/90 font-semibold hidden sm:inline">
            {dayjs(post.createdAt).format("DD MMMM YYYY").toUpperCase()}
          </span>
        </div>
      </div>

      {/* Sticky Reading Header Bar */}
      <nav className="w-full bg-background/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#dbc1bb]/40 py-3.5 px-6 lg:px-8 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <Link
            href="/blog"
            id="btn-back-blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#55423e] hover:text-[#8a3824] transition-colors py-1.5 px-3 rounded hover:bg-[#f4ece7]"
          >
            <ArrowLeft size={16} />
            <span>Volver al Cuaderno de Campo</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 text-xs font-serif text-[#55423e] max-w-md truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8a3824]" />
            <span className="truncate">{post.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleBookmark}
              aria-label="Guardar crónica"
              id="btn-bookmark-chronicle"
              className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                bookmarked
                  ? "bg-[#c6e7d6] border-[#1e3b2f] text-[#1e3b2f]"
                  : "bg-white border-[#dbc1bb] text-[#55423e] hover:text-[#8a3824] hover:border-[#8a3824]"
              }`}
            >
              <BookmarkSimple size={16} weight={bookmarked ? "fill" : "regular"} />
              <span className="hidden sm:inline">{bookmarked ? "Guardado" : "Guardar"}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              id="btn-blog-share"
              aria-label="Compartir crónica"
              className="p-2 rounded-lg bg-[#8a3824] text-white hover:bg-[#6c2210] transition-colors flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              <ShareNetwork size={16} />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Article Container */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-8 py-10">
        {/* MASTHEAD & TITLE CLUSTER */}
        <header className="max-w-4xl mx-auto mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#faf2ed] border border-[#c49a45]/40 text-[#8a3824] font-mono text-xs uppercase tracking-widest font-semibold rounded mb-4">
            <ShieldCheck size={14} />
            <span>{post.category || "CRÓNICA DE VIAJE"}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1e1b18] font-bold tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-[#55423e] leading-relaxed mb-6 max-w-3xl">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#88726d] pt-4 border-t border-[#dbc1bb]/40">
            <div className="flex items-center gap-2 text-[#1e1b18] font-semibold">
              <div className="w-8 h-8 rounded-full bg-[#faf2ed] border border-[#8a3824]/40 flex items-center justify-center text-[#8a3824] font-serif font-bold text-sm">
                {authorInitials}
              </div>
              <span>{authorName}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <time dateTime={post.createdAt}>{dayjs(post.createdAt).format("DD MMMM YYYY")}</time>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5 text-[#8a3824]">
              <Clock size={14} />
              <span>{readTime}</span>
            </div>
            {post.location && (
              <>
                <span>·</span>
                <div className="flex items-center gap-1 text-[#1e3b2f] font-semibold">
                  <MapPin size={14} />
                  <span>{post.location}</span>
                </div>
              </>
            )}
          </div>
        </header>

        {/* CINEMATIC HERO IMAGE */}
        {post.coverImage && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-xl border border-[#dbc1bb]/60">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                preload
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1e1b18]/80 via-[#1e1b18]/30 to-transparent p-6 text-white text-xs font-mono flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <span>{post.location || post.destination?.name || "Nicaragua"}</span>
                <span className="text-[#c49a45]">MOMOTOMBO TRAVELS</span>
              </div>
            </div>
          </div>
        )}

        {/* 12-COLUMN EDITORIAL CONTENT GRID */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Reading Column (8 cols) */}
          <article className="lg:col-span-8 space-y-8">
            {post.content ? (
              <div
                className="prose prose-lg max-w-none text-[#1e1b18] font-body-md leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
              />
            ) : null}

            {/* PUBLICATION FACT SHEET */}
            <div className="bg-[#faf2ed] border border-[#dbc1bb]/80 rounded-xl p-6 sm:p-8 space-y-4 my-10">
              <div className="flex items-center justify-between pb-3 border-b border-[#dbc1bb]/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e3b2f]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#1e1b18] font-bold">
                    Ficha de la Publicación
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#88726d] uppercase">CUADERNO DE CAMPO</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-3.5 rounded-lg border border-[#dbc1bb]/40">
                  <span className="font-mono text-[10px] text-[#88726d] uppercase block">Publicado</span>
                  <strong className="font-mono text-lg text-[#8a3824]">
                    {dayjs(post.createdAt).format("DD MMM YYYY")}
                  </strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-[#dbc1bb]/40">
                  <span className="font-mono text-[10px] text-[#88726d] uppercase block">Lectura</span>
                  <strong className="font-mono text-lg text-[#1e3b2f]">{readTime}</strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-[#dbc1bb]/40">
                  <span className="font-mono text-[10px] text-[#88726d] uppercase block">Destino</span>
                  <strong className="font-mono text-lg text-[#1e1b18]">
                    {post.destination?.name || post.location || "Nicaragua"}
                  </strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-[#dbc1bb]/40">
                  <span className="font-mono text-[10px] text-[#88726d] uppercase block">Sección</span>
                  <strong className="font-mono text-lg text-[#1e1b18]">
                    {post.category || "Crónica de viaje"}
                  </strong>
                </div>
              </div>
            </div>

            {/* ACADEMIC CITATION BOX */}
            <div className="bg-white border border-[#dbc1bb]/60 rounded-xl p-6 space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#88726d] font-bold block">
                Citación Recomendada (APA 7ma Ed.):
              </span>
              <p className="font-mono text-xs text-[#55423e] leading-relaxed bg-[#faf2ed] p-3 rounded border border-[#dbc1bb]/40">
                Momotombo Travels. ({dayjs(post.createdAt).year()}).{" "}
                <em>{post.title}</em>. Cuaderno de Campo de Momotombo Travels. https://momotombotravels.ni/blog/
                {post.slug}
              </p>
            </div>
          </article>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Table of Contents */}
            <div className="bg-white border border-[#dbc1bb]/60 rounded-xl p-6 space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#1e1b18] font-bold block">
                Índice de la Crónica
              </span>
              <nav className="space-y-2 font-mono text-xs text-[#55423e]">
                <a href="#descenso" className="block hover:text-[#8a3824] transition-colors">
                  I. El Descenso al Anillo Fumarólico
                </a>
                <a href="#historia" className="block hover:text-[#8a3824] transition-colors">
                  II. Crónicas Coloniales: Fray Bobadilla
                </a>
                <a href="#biodiversidad" className="block hover:text-[#8a3824] transition-colors">
                  III. La Ruta del Silencio: Chocoyos de Lava
                </a>
              </nav>
            </div>

            {/* Publisher Card */}
            <div className="bg-white border border-[#dbc1bb]/60 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#faf2ed] border border-[#8a3824]/40 flex items-center justify-center text-[#8a3824] font-serif font-bold text-lg">
                  {authorInitials}
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase text-[#1e1b18]">{authorName}</h4>
                  <p className="text-[11px] text-[#88726d]">Cuaderno de Campo</p>
                </div>
              </div>
              <p className="text-xs text-[#55423e] leading-relaxed">
                Crónicas y guías de viaje publicadas por Momotombo Travels, elaboradas a partir de nuestras rutas por
                Nicaragua.
              </p>
            </div>

            {/* VIP Expedition Booking Anchor Card */}
            <div className="bg-[#1e1b18] text-white border border-[#c49a45]/40 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#c49a45]/20 text-[#c49a45] rounded font-mono text-[10px] uppercase font-bold tracking-wider">
                <Compass size={14} />
                <span>CHARTER PRIVADO VIP</span>
              </div>
              <h3 className="font-serif text-xl font-bold">
                Expedición Nocturna al Cráter Santiago &amp; Cuevas
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Descenso exclusivo con guía local especializado, equipo de protección respiratoria y transporte 4x4
                privado.
              </p>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="font-serif text-2xl font-bold text-[#c49a45]">$280 USD</span>
                <span className="text-xs text-white/60 font-mono">/ persona</span>
              </div>
              <Link
                href="/explorar/granada-colonial"
                id="btn-book-expedition-sidebar"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#8a3824] hover:bg-[#6c2210] text-[#fff8f4] font-mono text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md transition-all"
              >
                <span>Reservar Esta Expedición</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </div>

        {/* RELATED CHRONICLES SECTION */}
        <section className="max-w-6xl mx-auto mt-20 pt-12 border-t border-[#dbc1bb]/60">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#1e1b18]">
              Otras Crónicas de la Cordillera
            </h3>
            <Link
              href="/blog"
              className="font-mono text-xs uppercase tracking-wider text-[#8a3824] hover:underline flex items-center gap-1"
            >
              <span>Ver Cuaderno Completo</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/blog/guia-definitiva-volcan-maderas"
              className="group bg-white border border-[#dbc1bb]/60 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col sm:flex-row"
            >
              <div className="relative sm:w-48 aspect-video sm:aspect-auto shrink-0 bg-[#e0d9d4]">
                <Image
                  src="https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Volcán Maderas"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 space-y-2">
                <span className="font-mono text-[10px] text-[#8a3824] uppercase font-bold">ALTA MONTAÑA</span>
                <h4 className="font-serif text-base font-bold text-[#1e1b18] group-hover:text-[#8a3824] transition-colors leading-snug">
                  Guía Definitiva para Escalar el Volcán Maderas
                </h4>
                <p className="text-xs text-[#55423e] line-clamp-2">
                  Laguna cráterica y bosque nuboso en la mística Isla de Ometepe.
                </p>
              </div>
            </Link>

            <Link
              href="/blog/5-playas-escondidas-san-juan-del-sur"
              className="group bg-white border border-[#dbc1bb]/60 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col sm:flex-row"
            >
              <div className="relative sm:w-48 aspect-video sm:aspect-auto shrink-0 bg-[#e0d9d4]">
                <Image
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Playas San Juan del Sur"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 space-y-2">
                <span className="font-mono text-[10px] text-[#8a3824] uppercase font-bold">COSTAS VÍRGENES</span>
                <h4 className="font-serif text-base font-bold text-[#1e1b18] group-hover:text-[#8a3824] transition-colors leading-snug">
                  5 Playas Vírgenes en San Juan del Sur
                </h4>
                <p className="text-xs text-[#55423e] line-clamp-2">
                  Acantilados basálticos y villas de teca en el litoral de Rivas.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Diplomatic Footer */}
      <footer className="w-full bg-[#eee7e2] border-t border-[#dbc1bb]/50 py-8 mt-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-[#dbc1bb]/40 font-mono text-xs tracking-wider uppercase text-[#88726d]">
            <div className="flex items-center gap-2">
              <span className="text-[#8a3824] font-bold">SOPORTE AL VIAJERO 24/7:</span>
              <strong className="text-[#1e1b18]">+505 2249-2760</strong>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#1e3b2f]" />
              <span>EXPEDICIONES EN TODO NICARAGUA</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#55423e]">
            <div>© 2025 Momotombo Travels. Todos los derechos reservados.</div>
            <nav className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px]">
              <Link href="/terminos" className="hover:text-[#8a3824] transition-colors">
                Manifiesto Geológico
              </Link>
              <span className="text-[#dbc1bb]">·</span>
              <Link href="/privacidad" className="hover:text-[#8a3824] transition-colors">
                Salvaguarda Ambiental
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
