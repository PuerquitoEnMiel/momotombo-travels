"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  Heart,
  ShareNetwork,
  CheckCircle,
  Calendar,
  NotePencil,
  Mountains,
  Compass,
  Warning,
  Users,
  Sun,
  Gauge,
  Plus,
  Minus,
  ArrowRight,
  ArrowUpRight,
  ChatsCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { BookingModal } from "@/components/features/commerce/BookingModal";
import { ReviewModal } from "@/components/features/commerce/ReviewModal";
import { Button } from "@/components/ui/Button";
import { Container, Spinner, ErrorState } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { destinationsService } from "@/services/destinations.service";
import type { Destination, PriceLevel, Activity } from "@/types/destination";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const PRICE_LABELS: Record<PriceLevel, string> = {
  FREE: "Gratis",
  LOW: "Desde $25 USD",
  MEDIUM: "Desde $75 USD",
  HIGH: "Desde $200 USD",
  LUXURY: "Desde $800 USD",
};

const PRICE_LEVEL_LABEL: Record<PriceLevel, string> = {
  FREE: "Gratuito",
  LOW: "$",
  MEDIUM: "$$",
  HIGH: "$$$",
  LUXURY: "$$$$",
};

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          weight={s <= Math.round(rating) ? "fill" : "regular"}
          className={
            s <= Math.round(rating)
              ? "text-[#C49A45]"
              : "text-[#dbc1bb]"
          }
        />
      ))}
    </span>
  );
}

function ActivityCard({ act }: { act: Activity }) {
  return (
    <article className="flex items-start gap-4 py-4 border-b border-[#E8E2D5] last:border-0">
      {/* thumbnail placeholder */}
      <div className="w-16 h-16 shrink-0 rounded-lg bg-surface-dim flex items-center justify-center overflow-hidden">
        <Mountains size={24} className="text-outline" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[#1e1b18] text-sm leading-snug mb-1">
          {act.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {act.duration != null && (
            <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container border border-[#dbc1bb] rounded-full px-2 py-0.5">
              <Clock size={10} aria-hidden="true" />
              {act.duration >= 60
                ? `${Math.round(act.duration / 60)}h`
                : `${act.duration}min`}
            </span>
          )}
          {act.price != null && act.price > 0 && (
            <span className="text-xs font-semibold text-[#6c2210] bg-[#ffdad2] rounded-full px-2 py-0.5">
              +${act.price} USD
            </span>
          )}
          {act.price === 0 && (
            <span className="text-xs font-semibold text-[#476557] bg-secondary-container rounded-full px-2 py-0.5">
              Incluido
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        className="text-xs text-[#8a3824] font-semibold underline underline-offset-4 hover:no-underline shrink-0 transition-colors"
      >
        Ver detalles
      </button>
    </article>
  );
}

/* ─── main page ───────────────────────────────────────────────────────────── */

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const toast = useToast();

  const [dest, setDest] = useState<Destination | null>(null);
  const [related, setRelated] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [guests, setGuests] = useState(2);

  const loadDestination = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    try {
      const [data, all] = await Promise.all([
        destinationsService.getBySlug(slug),
        destinationsService.list(),
      ]);
      setDest(data);
      setRelated(all.filter((d) => d.slug !== slug).slice(0, 3));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadDestination();
  }, [loadDestination]);

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share && dest) {
      try {
        await navigator.share({ title: dest.name, text: dest.description, url });
      } catch {
        /* cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    }
  }, [dest, toast]);

  /* ── loading / error states ── */
  if (loading) {
    return (
      <main
        className="min-h-screen bg-[#fff8f4] flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" className="text-[#8a3824]" />
          <p className="text-on-surface-variant text-sm tracking-wide">
            Cargando destino...
          </p>
        </div>
      </main>
    );
  }

  if (error || !dest) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-20 bg-[#fff8f4]">
        <Container size="md" className="py-16">
          <ErrorState
            icon={<Compass size={40} weight="duotone" />}
            title="Destino no encontrado"
            description="El destino que buscas no existe o no está disponible."
            onRetry={() => (window.location.href = "/explorar")}
          />
        </Container>
      </main>
    );
  }

  const images = dest.images?.length ? dest.images : [];
  const heroImage = images.find((i) => i.isHero) ?? images[0];
  const hasHero = !!heroImage?.url;
  const galleryImages = images.slice(0, 3);

  /* derived location */
  const loc = dest.location as
    | { lat?: number; lng?: number; address?: string }
    | undefined;

  return (
    <main className="min-h-screen bg-[#fff8f4]" id="destination-detail-page">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#211e1b]">
        {/* background image */}
        {hasHero ? (
          <Image
            src={heroImage!.url}
            alt={`${dest.name} — imagen principal`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#3d1f14] to-[#211e1b] flex items-center justify-center">
            <Mountains
              size={160}
              className="text-on-surface-variant/40"
              aria-hidden="true"
            />
          </div>
        )}

        {/* gradient overlay — heavier at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(33,30,27,0.88) 0%, rgba(33,30,27,0.40) 50%, rgba(33,30,27,0.10) 100%)",
          }}
          aria-hidden="true"
        />

        {/* breadcrumb — TOP of hero, directly below global Navbar */}
        <nav
          aria-label="Miga de pan"
          className="absolute top-20 left-0 right-0 z-20 px-10"
        >
          <ol className="flex items-center gap-2 text-xs text-white/60">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/30">›</li>
            <li>
              <Link href="/explorar" className="hover:text-white transition-colors">
                Explorar
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/30">›</li>
            <li className="text-white font-medium">{dest.name}</li>
          </ol>
        </nav>

        {/* bottom-left hero content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-16">
          <div className="max-w-[1440px] mx-auto flex items-end justify-between gap-8">
            {/* left: badge + title + tagline + excerpt */}
            <div className="flex-1 max-w-[580px]">
              {/* category badge */}
              <span className="inline-flex items-center gap-1.5 mb-4 text-[10px] font-bold tracking-[0.12em] uppercase bg-[#1e3b2f]/60 border border-[#476557]/50 text-[#adcebd] rounded-full px-3 py-1.5 backdrop-blur-sm">
                <Compass size={11} weight="fill" aria-hidden="true" />
                {dest.category?.name ?? "Destino"}
              </span>
              <h1 className="font-serif text-display-1 lg:text-[88px] font-semibold text-white mb-2 leading-[0.95] drop-shadow-2xl">
                {dest.name}
              </h1>
              {/* italic tagline — first sentence */}
              <p className="font-serif italic text-[22px] text-white/75 mb-3 leading-snug">
                {(dest.description?.split(".")[0] ?? dest.name) + "."}
              </p>
              {/* description excerpt */}
              {dest.description && dest.description.length > 80 && (
                <p className="text-sm text-white/55 leading-relaxed max-w-[440px]">
                  {dest.description.slice(0, 200)}{dest.description.length > 200 ? "…" : ""}
                </p>
              )}
            </div>

            {/* right: floating info card + action buttons */}
            <div className="shrink-0 flex flex-col items-end gap-3">
              {/* fav / share */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  id="btn-favorite-hero"
                  aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                  aria-pressed={isFavorite}
                  className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all focus-visible:outline-2 focus-visible:outline-[#C49A45] ${
                    isFavorite
                      ? "bg-[#8a3824]/80 border-[#8a3824] text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <Heart size={17} weight={isFavorite ? "fill" : "regular"} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  id="btn-share-hero"
                  aria-label="Compartir destino"
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all focus-visible:outline-2 focus-visible:outline-[#C49A45]"
                >
                  <ShareNetwork size={17} aria-hidden="true" />
                </button>
              </div>
              {/* SOLID WHITE price card — matches Stitch */}
              <div
                className="bg-white rounded-2xl p-5 min-w-[260px]"
                style={{
                  boxShadow: "0 20px 48px -8px rgba(33,30,27,0.22), 0 4px 14px -2px rgba(33,30,27,0.10)",
                }}
              >
                {/* header row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-outline">
                    Tarifa Expedición
                  </span>
                  <span className="text-[10px] font-bold tracking-wide uppercase bg-secondary-container text-[#1e3b2f] rounded-full px-2.5 py-0.5">
                    All-Inclusive
                  </span>
                </div>
                {/* price */}
                <p className="font-serif text-[26px] font-semibold text-[#1e1b18] mb-1 leading-tight">
                  {PRICE_LABELS[dest.priceLevel]}
                  <span className="text-sm font-normal text-outline ml-1">/ pers</span>
                </p>
                {/* rating */}
                <div className="flex items-center gap-2 mt-2">
                  <StarRow rating={dest.rating ?? 0} size={14} />
                  <span className="text-sm font-bold text-[#1e1b18]">
                    {dest.rating?.toFixed(1) ?? "—"}
                  </span>
                  <span className="text-xs text-outline">
                    ({dest.reviews?.length ?? 0} reseñas verificadas)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK STATS BAR ───────────────────────────────────────────────── */}
      <div className="border-y border-[#E8E2D5] bg-surface-container">
        <div className="max-w-[1440px] mx-auto px-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E8E2D5]">
            {[
              {
                icon: <Clock size={18} className="text-[#8a3824]" aria-hidden="true" />,
                label: "Duración",
                value: "1 – 3 días",
              },
              {
                icon: <Gauge size={18} className="text-[#8a3824]" aria-hidden="true" />,
                label: "Dificultad",
                value: "Moderado",
              },
              {
                icon: <Sun size={18} className="text-[#8a3824]" aria-hidden="true" />,
                label: "Mejor Época",
                value: "Nov – Abr",
              },
              {
                icon: <Users size={18} className="text-[#8a3824]" aria-hidden="true" />,
                label: "Capacidad",
                value: "Hasta 20 personas",
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 py-5 px-6 first:pl-0 last:pr-0"
              >
                {icon}
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    {label}
                  </dt>
                  <dd className="text-sm font-semibold text-[#1e1b18] mt-0.5">
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── left column (8 cols) ─────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-14">
            {/* Sobre el Destino */}
            <section aria-labelledby="section-about">
              <h2
                id="section-about"
                className="font-serif text-3xl font-medium text-[#1e1b18] mb-5"
              >
                Sobre el Destino
              </h2>
              <p className="text-on-surface-variant leading-[1.75] text-body">
                {dest.description}
              </p>
            </section>

            {/* Actividades */}
            {dest.activities && dest.activities.length > 0 && (
              <section aria-labelledby="section-activities">
                <h2
                  id="section-activities"
                  className="font-serif text-3xl font-medium text-[#1e1b18] mb-6"
                >
                  Actividades Disponibles
                </h2>
                <div className="bg-white border border-[#E8E2D5] rounded-2xl px-6 py-2">
                  {dest.activities.map((act) => (
                    <ActivityCard key={act.id} act={act} />
                  ))}
                </div>
              </section>
            )}

            {/* Amenidades */}
            {dest.amenities && dest.amenities.length > 0 && (
              <section aria-labelledby="section-amenities">
                <h2
                  id="section-amenities"
                  className="font-serif text-3xl font-medium text-[#1e1b18] mb-6"
                >
                  Amenidades
                </h2>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dest.amenities.map((am) => (
                    <li
                      key={am.id}
                      className="flex items-center gap-2.5 bg-white border border-[#E8E2D5] rounded-xl px-4 py-3"
                    >
                      <CheckCircle
                        size={16}
                        className="text-[#476557] shrink-0"
                        weight="fill"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-[#1e1b18]">{am.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Galería */}
            {galleryImages.length > 0 && (
              <section aria-labelledby="section-gallery">
                <h2
                  id="section-gallery"
                  className="font-serif text-3xl font-medium text-[#1e1b18] mb-6"
                >
                  Galería
                </h2>
                <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[380px]">
                  {/* main large image — spans 2 cols & 2 rows */}
                  <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden bg-surface-dim">
                    {galleryImages[0]?.url ? (
                      <Image
                        src={galleryImages[0].url}
                        alt={dest.name}
                        fill
                        sizes="(min-width:1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Mountains size={48} className="text-outline/50" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {/* secondary images */}
                  {[galleryImages[1], galleryImages[2]].map((img, i) => (
                    <div
                      key={i}
                      className="relative rounded-2xl overflow-hidden bg-surface-dim"
                    >
                      {img?.url ? (
                        <Image
                          src={img.url}
                          alt={`${dest.name} — foto ${i + 2}`}
                          fill
                          sizes="25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Mountains size={32} className="text-outline/50" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {images.length > 3 && (
                  <button
                    type="button"
                    className="mt-3 text-sm text-[#8a3824] font-semibold underline underline-offset-4 hover:no-underline transition-colors"
                  >
                    Ver galería completa ({images.length} fotos)
                  </button>
                )}
              </section>
            )}

            {/* Mapa */}
            <section aria-labelledby="section-map">
              <h2
                id="section-map"
                className="font-serif text-3xl font-medium text-[#1e1b18] mb-6"
              >
                Mapa de Ubicación
              </h2>
              <div className="bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden">
                <div className="h-52 bg-surface-dim flex flex-col items-center justify-center gap-3">
                  <MapPin
                    size={40}
                    className="text-[#8a3824]"
                    weight="fill"
                    aria-hidden="true"
                  />
                  {loc?.address && (
                    <p className="text-sm text-on-surface-variant">{loc.address}</p>
                  )}
                </div>
                <div className="px-5 py-4 border-t border-[#E8E2D5]">
                  {loc?.lat && loc?.lng ? (
                    <a
                      href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="link-google-maps"
                      className="inline-flex items-center gap-1.5 text-sm text-[#8a3824] font-semibold hover:underline focus-visible:underline"
                    >
                      Ver en Google Maps
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-sm text-outline">
                      Coordenadas no disponibles
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Reseñas */}
            <section aria-labelledby="section-reviews">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h2
                    id="section-reviews"
                    className="font-serif text-3xl font-medium text-[#1e1b18]"
                  >
                    Reseñas
                  </h2>
                  <span className="inline-flex items-center gap-1.5 bg-[#ffdad2] text-[#6c2210] text-sm font-bold px-3 py-1 rounded-full">
                    <Star size={13} weight="fill" aria-hidden="true" />
                    {dest.rating?.toFixed(1) ?? "—"}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsReviewOpen(true)}
                  id="btn-write-review"
                  iconLeft={<NotePencil size={14} />}
                >
                  Escribir reseña
                </Button>
              </div>

              {dest.reviews && dest.reviews.length > 0 ? (
                <div className="space-y-4">
                  {dest.reviews.map((rev) => (
                    <article
                      key={rev.id}
                      className="bg-white border border-[#E8E2D5] rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-surface-dim border border-[#dbc1bb] flex items-center justify-center">
                            <span className="text-sm font-bold text-[#8a3824]">
                              {(rev.user?.name ?? "A")[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[#1e1b18]">
                              {rev.user?.name ?? "Viajero anónimo"}
                            </p>
                            <time
                              dateTime={rev.createdAt}
                              className="text-[11px] text-outline"
                            >
                              {new Date(rev.createdAt).toLocaleDateString(
                                "es-NI",
                                { year: "numeric", month: "long", day: "numeric" }
                              )}
                            </time>
                          </div>
                        </div>
                        <StarRow rating={rev.rating} />
                      </div>
                      <p className="text-sm text-on-surface-variant leading-[1.7]">
                        {rev.comment}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#E8E2D5] rounded-2xl p-8 text-center">
                  <Warning
                    size={32}
                    className="mx-auto text-outline mb-2"
                    weight="duotone"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-on-surface-variant mb-1">
                    Aún no hay reseñas para este destino.
                  </p>
                  <p className="text-xs text-outline">
                    ¡Sé el primero en compartir tu experiencia!
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* ── right column — sticky booking sidebar (4 cols) ────────────── */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              {/* booking card */}
              <div
                className="bg-white border border-[#E8E2D5] rounded-2xl p-6"
                style={{
                  boxShadow:
                    "0 16px 36px -4px rgba(33,30,27,0.08), 0 4px 12px -2px rgba(33,30,27,0.03)",
                }}
              >
                {/* price */}
                <p className="font-serif text-2xl font-semibold text-[#1e1b18] mb-1">
                  {PRICE_LABELS[dest.priceLevel]}
                </p>
                <p className="text-xs text-outline mb-5">por persona</p>

                <div className="border-t border-[#E8E2D5] pt-5 space-y-4">
                  {/* date pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-outline mb-1.5 block">
                        Check-in
                      </span>
                      <div className="flex items-center gap-2 border border-[#dbc1bb] rounded-lg px-3 py-2.5 bg-white focus-within:border-[#8a3824] focus-within:shadow-[0_0_0_3px_rgba(138,56,36,0.12)] transition-all">
                        <Calendar size={14} className="text-outline" aria-hidden="true" />
                        <input
                          type="date"
                          className="text-xs text-[#1e1b18] bg-transparent outline-none w-full"
                          aria-label="Fecha de check-in"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-outline mb-1.5 block">
                        Check-out
                      </span>
                      <div className="flex items-center gap-2 border border-[#dbc1bb] rounded-lg px-3 py-2.5 bg-white focus-within:border-[#8a3824] focus-within:shadow-[0_0_0_3px_rgba(138,56,36,0.12)] transition-all">
                        <Calendar size={14} className="text-outline" aria-hidden="true" />
                        <input
                          type="date"
                          className="text-xs text-[#1e1b18] bg-transparent outline-none w-full"
                          aria-label="Fecha de check-out"
                        />
                      </div>
                    </label>
                  </div>

                  {/* guests stepper */}
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-outline mb-1.5 block">
                      Huéspedes
                    </span>
                    <div className="flex items-center justify-between border border-[#dbc1bb] rounded-lg px-4 py-2.5">
                      <button
                        type="button"
                        aria-label="Reducir huéspedes"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="w-7 h-7 rounded-full bg-surface-dim hover:bg-[#ffdad2] text-[#1e1b18] flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} aria-hidden="true" />
                      </button>
                      <span
                        className="text-sm font-semibold text-[#1e1b18]"
                        aria-live="polite"
                      >
                        {guests} {guests === 1 ? "persona" : "personas"}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar huéspedes"
                        onClick={() => setGuests((g) => Math.min(20, g + 1))}
                        className="w-7 h-7 rounded-full bg-surface-dim hover:bg-[#ffdad2] text-[#1e1b18] flex items-center justify-center transition-colors"
                      >
                        <Plus size={12} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* price summary */}
                  <div className="bg-surface-container rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-xs text-on-surface-variant">
                      <span>Precio base</span>
                      <span className="font-medium text-[#1e1b18]">
                        {PRICE_LEVEL_LABEL[dest.priceLevel]}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant">
                      <span>Viajeros</span>
                      <span className="font-medium text-[#1e1b18]">{guests}</span>
                    </div>
                    <div className="border-t border-[#dbc1bb] pt-2 flex justify-between text-sm font-bold text-[#1e1b18]">
                      <span>Subtotal estimado</span>
                      <span className="text-[#8a3824]">A consultar</span>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(true)}
                    id="btn-book-now"
                    className="w-full bg-[#8a3824] hover:bg-[#6c2210] text-white font-semibold text-sm tracking-wide py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[#C49A45]"
                  >
                    Reservar Ahora
                  </button>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event("open-chat"))}
                    id="btn-add-itinerary"
                    className="w-full border border-[#1e1b18] text-[#1e1b18] hover:bg-[#1e1b18] hover:text-white font-semibold text-sm tracking-wide py-3.5 rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#C49A45]"
                  >
                    Añadir a mi Itinerario
                  </button>

                  <p className="text-center text-[11px] text-outline">
                    Cancelación gratuita hasta 48h antes
                  </p>
                </div>
              </div>

              {/* guide concierge card */}
              <div className="bg-white border border-[#E8E2D5] rounded-2xl p-5">
                <p className="text-sm font-semibold text-[#1e1b18] mb-1">
                  ¿Necesitas ayuda?
                </p>
                <p className="text-xs text-outline mb-4">
                  Habla con uno de nuestros guías certificados.
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-dim border border-[#dbc1bb] flex items-center justify-center">
                    <span className="text-sm font-bold text-[#8a3824]">G</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1e1b18]">
                      Guía Experto
                    </p>
                    <p className="text-[11px] text-outline">
                      Respuesta en &lt; 1 hora
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-contact-guide"
                  className="w-full border border-[#dbc1bb] text-on-surface-variant hover:border-[#8a3824] hover:text-[#8a3824] text-xs font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ChatsCircle size={14} aria-hidden="true" />
                  Hablar con un Guía
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── RELATED DESTINATIONS ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          className="border-t border-[#E8E2D5] py-16 bg-surface-container"
          aria-labelledby="section-related"
        >
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="flex items-center justify-between mb-8">
              <h2
                id="section-related"
                className="font-serif text-3xl font-medium text-[#1e1b18]"
              >
                También te puede interesar
              </h2>
              <Link
                href="/explorar"
                className="inline-flex items-center gap-1.5 text-sm text-[#8a3824] font-semibold hover:gap-2.5 transition-all"
              >
                Ver todos
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => {
                const relHero = rel.images?.find((i) => i.isHero) ?? rel.images?.[0];
                return (
                  <Link
                    key={rel.id}
                    href={`/explorar/${rel.slug}`}
                    id={`related-dest-${rel.slug}`}
                    className="group relative aspect-video rounded-2xl overflow-hidden bg-[#211e1b] focus-visible:outline-2 focus-visible:outline-[#C49A45]"
                  >
                    {relHero?.url ? (
                      <Image
                        src={relHero.url}
                        alt={rel.name}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-[#3d1f14] to-[#211e1b] flex items-center justify-center">
                        <Mountains size={48} className="text-on-surface-variant/40" aria-hidden="true" />
                      </div>
                    )}
                    {/* vignette */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(33,30,27,0.75) 0%, transparent 55%)",
                      }}
                      aria-hidden="true"
                    />
                    {/* category badge */}
                    <span className="absolute top-3 right-3 text-[10px] font-bold tracking-[0.08em] uppercase bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full px-2.5 py-1">
                      {rel.category?.name}
                    </span>
                    {/* bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                      <div>
                        <p className="font-serif text-lg font-semibold text-white leading-tight">
                          {rel.name}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={11} weight="fill" className="text-[#C49A45]" aria-hidden="true" />
                          <span className="text-xs text-white/80 font-medium">
                            {rel.rating?.toFixed(1) ?? "—"}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white/70">
                        {PRICE_LEVEL_LABEL[rel.priceLevel]}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer is rendered globally by the app layout */}

      {/* ── MODALS ────────────────────────────────────────────────────────── */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        activities={dest.activities ?? []}
        destinationId={dest.id}
        destinationName={dest.name}
      />
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        destinationId={dest.id}
        onReviewAdded={loadDestination}
      />
    </main>
  );
}
