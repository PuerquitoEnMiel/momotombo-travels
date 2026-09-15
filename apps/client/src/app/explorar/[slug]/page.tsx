"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Star, MapPin, Clock, CurrencyDollar, ArrowLeft, Heart, ShareNetwork, Sparkle, CheckCircle, Calendar, NotePencil, Mountains, Compass, Warning } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BookingModal } from "@/components/features/commerce/BookingModal";
import { ReviewModal } from "@/components/features/commerce/ReviewModal";
import { Button } from "@/components/ui/Button";
import { Container, Spinner, ErrorState } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { destinationsService } from "@/services/destinations.service";
import type { Destination, PriceLevel } from "@/types/destination";

const PRICE_LABELS: Record<PriceLevel, string> = {
  FREE: "Gratis",
  LOW: "$",
  MEDIUM: "$$",
  HIGH: "$$$",
  LUXURY: "$$$$",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          weight={s <= Math.round(rating) ? "fill" : "regular"}
          className={s <= Math.round(rating) ? "text-oro-indigena" : "text-outline"}
        />
      ))}
    </div>
  );
}

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const toast = useToast();

  const [dest, setDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const loadDestination = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    try {
      const data = await destinationsService.getBySlug(slug);
      setDest(data);
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
        /* user cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    }
  }, [dest, toast]);

  if (loading) {
    return (
      <main className="min-h-screen bg-volcano-black flex items-center justify-center" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" className="text-primary" />
          <p className="text-gray-400 animate-pulse">Cargando destino...</p>
        </div>
      </main>
    );
  }

  if (error || !dest) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-20">
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

  const images = dest.images && dest.images.length > 0
    ? dest.images
    : [{ id: "placeholder", url: "", isHero: true, destinationId: dest.id }];

  const heroImage = images.find((i) => i.isHero) ?? images[0];
  const hasRealImages = heroImage && heroImage.url;

  return (
    <main className="min-h-screen bg-surface-container-lowest">
      <section className="relative h-[70vh] w-full overflow-hidden bg-volcano-black">
        {hasRealImages ? (
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeImage]?.url || heroImage!.url}
              alt={`${dest.name} - Imagen ${activeImage + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gradient-to-br from-gray-800 to-volcano-black">
            <Mountains size={120} weight="duotone" className="text-on-surface-variant/30" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" aria-hidden="true" />

        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
          <Link
            href="/explorar"
            id="btn-back-explorar"
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-nica-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 active:scale-[0.97] transition-all duration-300 ease-out-expo border border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro-indigena"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Explorar
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              id="btn-favorite"
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              aria-pressed={isFavorite}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border active:scale-[0.97] transition-all duration-300 ease-out-expo focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro-indigena ${
                isFavorite ? "bg-danger border-danger text-nica-white" : "bg-white/10 border-white/20 text-nica-white hover:bg-white/20"
              }`}
            >
              <Heart size={18} weight={isFavorite ? "fill" : "regular"} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              id="btn-share"
              aria-label="Compartir destino"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-nica-white flex items-center justify-center hover:bg-white/20 active:scale-[0.97] transition-all duration-300 ease-out-expo focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro-indigena"
            >
              <ShareNetwork size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-oro-indigena text-sm font-medium tracking-widest uppercase mb-2 block">
              {dest.category?.name}
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-nica-white mb-3 drop-shadow-2xl text-balance">
              {dest.name}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <StarRating rating={dest.rating} />
                <span className="text-nica-white font-bold text-sm">{dest.rating?.toFixed(1) ?? "—"}</span>
              </div>
              {(dest as Destination & { location?: { address?: string } }).location?.address && (
                <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                  <MapPin size={14} aria-hidden="true" />
                  <span>{(dest as Destination & { location?: { address?: string } }).location?.address}</span>
                </div>
              )}
              <div className="bg-primary/80 backdrop-blur-sm text-nica-white px-3 py-1 rounded-full text-sm font-bold">
                {PRICE_LABELS[dest.priceLevel]}
              </div>
            </div>
          </motion.div>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-28 right-6 flex flex-col gap-2 z-10" role="tablist" aria-label="Galería de imágenes">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={img.id}
                type="button"
                role="tab"
                aria-selected={activeImage === i}
                aria-label={`Ver imagen ${i + 1}`}
                onClick={() => setActiveImage(i)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro-indigena ${
                  activeImage === i ? "border-oro-indigena scale-110" : "border-white/30 opacity-60 hover:opacity-100"
                }`}
              >
                {img.url ? (
                  <Image src={img.url} alt="" width={56} height={56} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Mountains size={20} className="text-gray-500" aria-hidden="true" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              aria-labelledby="about-heading"
            >
              <h2 id="about-heading" className="font-serif text-3xl font-bold text-on-surface mb-4 text-balance">
                Sobre {dest.name}
              </h2>
              <p className="text-on-surface-variant leading-relaxed text-lg text-pretty">{dest.description}</p>
            </motion.section>

            {dest.activities && dest.activities.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                aria-labelledby="activities-heading"
              >
                <h2 id="activities-heading" className="font-serif text-3xl font-bold text-on-surface mb-6 text-balance">
                  Actividades
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dest.activities.map((act) => (
                    <article
                      key={act.id}
                      className="group bg-gradient-to-br from-surface-container-low to-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 ease-out-expo"
                    >
                      <h3 className="font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{act.name}</h3>
                      {act.description && <p className="text-on-surface-variant text-sm mb-3 leading-relaxed text-pretty">{act.description}</p>}
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        {act.price != null && (
                          <div className="flex items-center gap-1 text-secondary font-semibold">
                            <CurrencyDollar size={14} aria-hidden="true" />
                            <span>${act.price} USD</span>
                          </div>
                        )}
                        {act.duration != null && (
                          <div className="flex items-center gap-1 text-on-surface-variant">
                            <Clock size={14} aria-hidden="true" />
                            <span>{act.duration >= 60 ? `${Math.round(act.duration / 60)}h` : `${act.duration}min`}</span>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </motion.section>
            )}

            {dest.amenities && dest.amenities.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                aria-labelledby="amenities-heading"
              >
                <h2 id="amenities-heading" className="font-serif text-3xl font-bold text-on-surface mb-6 text-balance">
                  Qué incluye
                </h2>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dest.amenities.map((am) => (
                    <li key={am.id} className="flex items-center gap-2 text-on-surface">
                      <CheckCircle size={16} className="text-secondary shrink-0" weight="fill" aria-hidden="true" />
                      <span className="text-sm">{am.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              aria-labelledby="reviews-heading"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <h2 id="reviews-heading" className="font-serif text-3xl font-bold text-on-surface text-balance">
                    Reseñas
                  </h2>
                  <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full">
                    <Star size={16} className="text-oro-indigena" weight="fill" aria-hidden="true" />
                    <span className="text-lg font-bold text-on-surface">{dest.rating?.toFixed(1) ?? "—"}</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsReviewOpen(true)}
                  id="btn-review-write"
                  iconLeft={<NotePencil size={14} />}
                >
                  Escribir reseña
                </Button>
              </div>

              {dest.reviews && dest.reviews.length > 0 ? (
                <div className="space-y-4">
                  {dest.reviews.map((rev) => (
                    <article key={rev.id} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30">
                      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                        <div>
                          <p className="font-bold text-on-surface">{rev.user?.name || "Viajero anónimo"}</p>
                          <p className="text-on-surface-variant text-xs">
                            <time dateTime={rev.createdAt}>
                              {new Date(rev.createdAt).toLocaleDateString("es-NI", { year: "numeric", month: "long", day: "numeric" })}
                            </time>
                          </p>
                        </div>
                        <StarRating rating={rev.rating} />
                      </div>
                      <p className="text-on-surface-variant leading-relaxed text-pretty">{rev.comment}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-surface-container-low rounded-2xl p-8 text-center border border-outline-variant/30">
                  <Warning size={32} className="mx-auto text-outline mb-2" weight="duotone" aria-hidden="true" />
                  <p className="text-on-surface-variant mb-2">Aún no hay reseñas para este destino.</p>
                  <p className="text-sm text-on-surface-variant/70">¡Sé el primero en compartir tu experiencia!</p>
                </div>
              )}
            </motion.section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-gradient-to-br from-volcano-black to-gray-800 rounded-2xl p-6 text-nica-white shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkle size={18} className="text-oro-indigena" aria-hidden="true" />
                  <span className="text-oro-indigena text-sm font-medium">Reserva o Planifica</span>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2 text-balance">¿Listo para tu viaje?</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed text-pretty">Reserva una actividad directamente o usa IA para planificar todo el viaje.</p>

                <div className="space-y-3">
                  {dest.activities && dest.activities.length > 0 && (
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => setIsBookingOpen(true)}
                      id="btn-book-now"
                      iconLeft={<Calendar size={16} />}
                    >
                      Reservar ahora
                    </Button>
                  )}
                  <Button
                    variant="glass"
                    fullWidth
                    onClick={() => window.dispatchEvent(new Event("open-chat"))}
                    id="btn-plan-chat"
                    iconLeft={<Sparkle size={16} />}
                  >
                    Planear con Kary
                  </Button>
                </div>
              </div>

              {(dest as Destination & { location?: { lat?: number; lng?: number; address?: string } }).location?.lat && (
                <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30">
                  <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-primary" aria-hidden="true" />
                    Ubicación
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-3 text-pretty">{(dest as Destination & { location?: { address?: string } }).location?.address}</p>
                  <a
                    href={`https://www.google.com/maps?q=${(dest as Destination & { location?: { lat?: number; lng?: number } }).location?.lat},${(dest as Destination & { location?: { lat?: number; lng?: number } }).location?.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="link-google-maps"
                    className="text-primary text-sm font-medium hover:underline focus-visible:underline"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              )}

              <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30">
                <h3 className="font-bold text-on-surface mb-4">Datos rápidos</h3>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-on-surface-variant">Categoría</dt>
                    <dd className="font-medium text-on-surface">{dest.category?.name}</dd>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-on-surface-variant">Precio</dt>
                    <dd className="font-medium text-on-surface">{PRICE_LABELS[dest.priceLevel]}</dd>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-on-surface-variant">Actividades</dt>
                    <dd className="font-medium text-on-surface">{dest.activities?.length ?? 0}</dd>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-on-surface-variant">Rating</dt>
                    <dd className="flex items-center gap-1 font-medium text-on-surface">
                      <Star size={12} className="text-oro-indigena" weight="fill" aria-hidden="true" />
                      {dest.rating?.toFixed(1) ?? "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        activities={dest.activities || []}
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
