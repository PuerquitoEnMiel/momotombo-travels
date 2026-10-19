"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  CalendarBlank,
  Trophy,
  Medal,
  SignOut,
  Sparkle,
  CreditCard,
  Phone,
  CaretRight,
  CheckCircle,
  Lock,
  DownloadSimple,
  ShareNetwork,
  MapTrifold,
  Mountains,
  Compass,
  Check,
  EnvelopeSimple,
  Heart,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner, ErrorState, Container, EmptyState } from "@/components/ui";
import { bookingsService } from "@/services/bookings.service";
import { destinationsService, type FavoriteEntry } from "@/services/destinations.service";
import type { Badge } from "@/services/gamification.service";
import type { AuthUser } from "@/types/user";

/* ---------------------------------------------------------------------------
 * Real-data view models. The API returns richer records than the shared client
 * types declare (e.g. /auth/me includes createdAt + profile, bookings include
 * activity.destination); these local shapes keep the page type-safe without
 * touching the shared type modules.
 * ------------------------------------------------------------------------- */

type TravelerBadge = Badge & { pointsReq?: number };

type ProfileUser = AuthUser & {
  createdAt?: string | null;
  profile?: {
    bio?: string | null;
    avatarUrl?: string | null;
    phoneNumber?: string | null;
  } | null;
};

interface BookingDestinationInfo {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  images?: Array<{ url: string; isHero?: boolean }>;
}

interface BookingActivityInfo {
  id: string;
  name?: string;
  destination?: BookingDestinationInfo | null;
}

interface TravelerBooking {
  id: string;
  activityId: string;
  date: string;
  status: string;
  totalPrice: number | string;
  currency?: string;
  guests?: number;
  confirmationCode?: string | null;
  activity?: BookingActivityInfo | null;
}

const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  REFUNDED: "Reembolsada",
  EXPIRED: "Expirada",
};

function formatBookingDate(value: string): string {
  return dayjs(value).locale("es").format("D [de] MMMM [de] YYYY");
}

export default function PerfilPage() {
  const router = useRouter();
  const { user, gamification, loading, error, logout, refresh } = useAuth();
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [copiedLink, setCopiedLink] = useState(false);
  const [bookings, setBookings] = useState<TravelerBooking[] | null>(null);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteEntry[] | null>(null);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const loadBookings = useCallback(async () => {
    if (!user) return;
    setBookingsLoading(true);
    setBookingsError(false);
    try {
      const data = await bookingsService.list();
      setBookings((data as unknown as TravelerBooking[]) ?? []);
    } catch {
      setBookings(null);
      setBookingsError(true);
    } finally {
      setBookingsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) void loadBookings();
  }, [user, loadBookings]);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    setFavoritesLoading(true);
    setFavoritesError(false);
    try {
      const data = await destinationsService.listFavorites();
      setFavorites(data ?? []);
    } catch {
      setFavorites(null);
      setFavoritesError(true);
    } finally {
      setFavoritesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) void loadFavorites();
  }, [user, loadFavorites]);

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-container-low flex items-center justify-center" role="status">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" />
          <p className="text-on-surface-variant animate-pulse text-sm font-medium">
            Cargando credenciales de expedición...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-surface-container-low flex items-center justify-center p-6">
        <ErrorState description={error} onRetry={() => router.push("/auth/login")} />
      </main>
    );
  }

  if (!user) return null;

  /* ── derived from real API data (no fabricated fallbacks) ─────────────── */

  const traveler = user as ProfileUser;
  const memberSince = traveler.createdAt
    ? dayjs(traveler.createdAt).locale("es").format("MMMM YYYY")
    : null;

  const currentPoints = gamification?.points ?? null;
  const nextThreshold = gamification?.nextLevelThreshold ?? null;
  const userLevel = gamification?.level ?? null;
  const progressPercentage =
    currentPoints !== null && nextThreshold
      ? Math.min((currentPoints / nextThreshold) * 100, 100)
      : 0;
  const xpRemaining =
    currentPoints !== null && nextThreshold ? Math.max(nextThreshold - currentPoints, 0) : null;

  const earnedBadges = (gamification?.earnedBadges ?? []) as TravelerBadge[];
  const lockedBadges = (gamification?.availableBadges ?? []) as TravelerBadge[];
  const totalBadges = earnedBadges.length + lockedBadges.length;
  const catalogPercentage =
    totalBadges > 0 ? Math.round((earnedBadges.length / totalBadges) * 100) : 0;

  const allBadgeRows = [
    ...earnedBadges.map((badge) => ({ badge, unlocked: true })),
    ...lockedBadges.map((badge) => ({ badge, unlocked: false })),
  ];
  const filteredBadges = allBadgeRows.filter((row) => {
    if (badgeFilter === "unlocked") return row.unlocked;
    if (badgeFilter === "locked") return !row.unlocked;
    return true;
  });

  const today = dayjs().startOf("day");
  const upcomingBookings = (bookings ?? [])
    .filter((b) => ["PENDING", "CONFIRMED"].includes(b.status) && !dayjs(b.date).isBefore(today, "day"))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  const nextExpedition = upcomingBookings[0] ?? null;
  const uniqueDestinations = new Set(
    (bookings ?? []).map((b) => b.activity?.destination?.slug ?? b.activity?.destination?.name ?? b.activityId)
  ).size;

  const nextDestination = nextExpedition?.activity?.destination ?? null;
  const nextDestinationImage =
    nextDestination?.images?.find((i) => i.isHero) ?? nextDestination?.images?.[0] ?? null;
  const nextExpeditionTitle =
    nextExpedition?.activity?.name ?? nextDestination?.name ?? "Expedición reservada";
  const nextStatusLabel = nextExpedition
    ? BOOKING_STATUS_LABELS[nextExpedition.status] ?? nextExpedition.status
    : null;

  const handleSharePassport = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleOpenAiPlan = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-chat"));
    }
  };

  const handleDownloadDossier = () => {
    toast.info("El dossier y voucher en PDF estarán disponibles próximamente.");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col">
      {/* ========================================================================= */}
      {/* 1. TRAVELER IDENTITY & EXPEDITION PASS (Hero Banner) */}
      {/* ========================================================================= */}
      <section className="relative bg-surface-container-high border-b border-outline-variant/40 pt-10 pb-12 overflow-hidden">
        {/* Subtle Topographic Accent */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 10% 20%, rgba(138,56,36,0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(30,59,47,0.15) 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />

        <Container size="lg" className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Identity Information */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar with Metallic Halo */}
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-oro-indigena via-primary to-secondary shadow-lg">
                  <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center overflow-hidden">
                    {traveler.avatarUrl ? (
                      <Image
                        src={traveler.avatarUrl}
                        alt={user.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center font-serif text-3xl font-bold text-primary">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio & Membership */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {memberSince && (
                    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                      <CalendarBlank size={12} /> Miembro desde {memberSince}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
                    {user.name}
                  </h1>
                  {user.role === "ADMIN" && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/20 text-amber-700 border border-amber-500/30">
                      ADMIN
                    </span>
                  )}
                </div>

                <p className="text-on-surface-variant text-sm flex items-center gap-2 mt-1">
                  <EnvelopeSimple size={16} className="text-primary" />
                  <span className="text-xs text-on-surface-variant">{user.email}</span>
                </p>
              </div>
            </div>

            {/* Gamification Level & XP Pass Widget */}
            <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-5 shadow-sm min-w-[320px] max-w-md w-full">
              {gamification && currentPoints !== null ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block">
                        Prestigio de Campo
                      </span>
                      <span className="font-serif text-xl font-bold text-primary">
                        {userLevel !== null ? `Nivel ${userLevel}` : `${currentPoints} XP acumulados`}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary border border-outline-variant/50">
                      <Trophy size={22} weight="duotone" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-on-surface font-bold">{currentPoints} XP</span>
                      <span className="text-on-surface-variant font-medium">
                        Meta: {nextThreshold} XP
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-primary via-primary-container to-oro-indigena rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    {xpRemaining !== null && (
                      <p className="text-[11px] text-on-surface-variant text-right mt-1 font-medium">
                        {xpRemaining} XP restantes para el siguiente nivel
                      </p>
                    )}
                  </div>

                  {/* Recent earned badges (real names, no fabricated XP) */}
                  {earnedBadges.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-outline-variant/40">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block mb-1.5">
                        Insignias recientes
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {earnedBadges.slice(0, 4).map((badge) => (
                          <span
                            key={badge.id}
                            className="px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container text-[10px] font-semibold"
                          >
                            {badge.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  size="sm"
                  icon={<Trophy size={28} weight="duotone" />}
                  title="Sin datos de experiencia"
                  description="Tu progreso de expedición aparecerá aquí cuando esté disponible."
                />
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between gap-2">
                <button
                  type="button"
                  id="btn-share-passport"
                  onClick={handleSharePassport}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copiedLink ? <Check size={14} /> : <ShareNetwork size={14} />}
                  {copiedLink ? "¡Copiado!" : "Compartir Perfil"}
                </button>
                <button
                  type="button"
                  id="btn-logout"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                  title="Cerrar Sesión"
                  aria-label="Cerrar Sesión"
                >
                  <SignOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. METRICS BAR (derived from bookings + gamification) */}
      {/* ========================================================================= */}
      <section className="relative z-20 -mt-6">
        <Container size="lg">
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-10 bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
              <Spinner size="lg" />
            </div>
          ) : !bookings && !gamification ? (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
              <EmptyState
                icon={<Compass size={28} weight="duotone" />}
                title="Aún no hay datos de expedición"
                description="Tus métricas de viaje aparecerán aquí cuando reserves tu primera expedición."
                action={
                  bookingsError
                    ? { label: "Reintentar", onClick: () => void loadBookings() }
                    : { label: "Explorar destinos", onClick: () => router.push("/explorar") }
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bookings && (
                <div className="bg-surface-container-lowest border border-outline-variant/60 p-5 rounded-xl shadow-xs flex items-center gap-4 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    <Compass size={24} weight="duotone" />
                  </div>
                  <div>
                    <span className="font-serif text-2xl font-bold text-on-surface leading-none block">{uniqueDestinations}</span>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-text-muted mt-1 block">
                      Destinos Reservados
                    </span>
                    <span className="text-xs text-secondary font-semibold">
                      {bookings.length} {bookings.length === 1 ? "reserva en total" : "reservas en total"}
                    </span>
                  </div>
                </div>
              )}

              {bookings && (
                <div className="bg-surface-container-lowest border border-outline-variant/60 p-5 rounded-xl shadow-xs flex items-center gap-4 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-tertiary-text">
                    <CalendarBlank size={24} weight="duotone" />
                  </div>
                  <div>
                    <span className="font-serif text-2xl font-bold text-on-surface leading-none block">{upcomingBookings.length}</span>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-text-muted mt-1 block">
                      Próximas Expediciones
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {nextExpedition
                        ? `Próxima: ${dayjs(nextExpedition.date).locale("es").format("D MMM YYYY")}`
                        : "Sin fechas próximas"}
                    </span>
                  </div>
                </div>
              )}

              {gamification && (
                <div className="bg-surface-container-lowest border border-outline-variant/60 p-5 rounded-xl shadow-xs flex items-center gap-4 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    <Medal size={24} weight="duotone" />
                  </div>
                  <div>
                    <span className="font-serif text-2xl font-bold text-on-surface leading-none block">
                      {earnedBadges.length} / {totalBadges}
                    </span>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-text-muted mt-1 block">
                      Medallas Desbloqueadas
                    </span>
                    <span className="text-xs text-primary font-semibold">{catalogPercentage}% del Catálogo</span>
                  </div>
                </div>
              )}

              {gamification && currentPoints !== null && (
                <div className="bg-surface-container-lowest border border-outline-variant/60 p-5 rounded-xl shadow-xs flex items-center gap-4 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                    <Trophy size={24} weight="duotone" />
                  </div>
                  <div>
                    <span className="font-serif text-2xl font-bold text-on-surface leading-none block">{currentPoints}</span>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-text-muted mt-1 block">
                      Puntos de Experiencia
                    </span>
                    <span className="text-xs text-secondary font-semibold">
                      {userLevel !== null ? `Nivel ${userLevel}` : `Meta: ${nextThreshold} XP`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRIMARY ASYMMETRIC CONTENT GRID (8 Cols Main : 4 Cols Sidebar) */}
      {/* ========================================================================= */}
      <main className="py-12 w-full flex-1">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* MAIN COLUMN (8 Columns) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* ------------------------------------------------------------------- */}
              {/* SECCIÓN A: Medallero Volcánico & Logros de Aventura */}
              {/* ------------------------------------------------------------------- */}
              <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 md:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-outline-variant/40 mb-6 gap-4">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest uppercase text-primary font-bold block mb-1">
                      Insignias & Récords Geológicos
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-on-surface">
                      Medallero Volcánico de Expedición
                    </h2>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-lg border border-outline-variant/30 text-xs">
                    <button
                      type="button"
                      onClick={() => setBadgeFilter("all")}
                      className={`px-3 py-1 rounded font-medium transition-colors ${
                        badgeFilter === "all"
                          ? "bg-secondary text-on-secondary shadow-xs font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Todas ({allBadgeRows.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadgeFilter("unlocked")}
                      className={`px-3 py-1 rounded font-medium transition-colors ${
                        badgeFilter === "unlocked"
                          ? "bg-secondary text-on-secondary shadow-xs font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Desbloqueadas ({earnedBadges.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadgeFilter("locked")}
                      className={`px-3 py-1 rounded font-medium transition-colors ${
                        badgeFilter === "locked"
                          ? "bg-secondary text-on-secondary shadow-xs font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Pendientes ({lockedBadges.length})
                    </button>
                  </div>
                </div>

                {/* Badges Grid (real gamification data only) */}
                {!gamification ? (
                  <EmptyState
                    size="sm"
                    icon={<Medal size={28} weight="duotone" />}
                    title="No pudimos cargar tus insignias"
                    description="Revisa tu conexión e inténtalo de nuevo para ver tu medallero."
                    action={{ label: "Reintentar", onClick: () => void refresh() }}
                  />
                ) : allBadgeRows.length === 0 ? (
                  <EmptyState
                    size="sm"
                    icon={<Medal size={28} weight="duotone" />}
                    title="Tu medallero está vacío"
                    description="Completa expediciones y actividades para desbloquear tus primeras medallas."
                    action={{ label: "Explorar expediciones", onClick: () => router.push("/explorar") }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {filteredBadges.map(({ badge, unlocked }) => (
                        <motion.div
                          key={badge.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                            unlocked
                              ? "bg-surface border-outline-variant/50 hover:border-oro-indigena/60 hover:shadow-sm"
                              : "bg-surface-container/40 border-dashed border-outline-variant/80 opacity-75"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-2.5">
                              <div
                                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xs overflow-hidden ${
                                  unlocked
                                    ? "bg-gradient-to-br from-oro-indigena to-primary text-nica-white"
                                    : "bg-surface-container-highest text-text-muted"
                                }`}
                              >
                                {badge.iconUrl ? (
                                  <Image
                                    src={badge.iconUrl}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                  />
                                ) : unlocked ? (
                                  <Medal size={20} weight="fill" />
                                ) : (
                                  <Lock size={20} />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`text-[10px] font-mono uppercase font-bold ${
                                      unlocked ? "text-secondary" : "text-text-muted"
                                    }`}
                                  >
                                    {unlocked ? "Desbloqueada" : "Bloqueada"}
                                  </span>
                                  {unlocked && <CheckCircle size={12} className="text-secondary" weight="fill" />}
                                </div>
                                <h3 className="font-serif text-sm font-bold text-on-surface leading-snug">
                                  {badge.name}
                                </h3>
                              </div>
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              {badge.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-outline-variant/30 text-[11px] text-on-surface-variant">
                            {unlocked
                              ? "En tu medallero"
                              : badge.pointsReq != null
                                ? `Requiere ${badge.pointsReq} XP`
                                : "Pendiente"}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </section>

              {/* ------------------------------------------------------------------- */}
              {/* SECCIÓN B: Próximas Expediciones & Reservas Activas */}
              {/* ------------------------------------------------------------------- */}
              <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 md:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant/40 mb-6 gap-2">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest uppercase text-secondary font-bold block mb-1">
                      Itinerario Confirmado
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-on-surface">
                      Próxima Expedición Activa
                    </h2>
                  </div>
                  {nextExpedition && nextStatusLabel && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold w-fit">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                      {nextStatusLabel}
                    </span>
                  )}
                </div>

                {/* Editorial Feature Card — real booking data only */}
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Spinner size="lg" />
                  </div>
                ) : bookingsError ? (
                  <EmptyState
                    size="sm"
                    icon={<CalendarBlank size={28} weight="duotone" />}
                    title="No pudimos cargar tus reservas"
                    description="Revisa tu conexión e inténtalo de nuevo para ver tu próxima expedición."
                    action={{ label: "Reintentar", onClick: () => void loadBookings() }}
                  />
                ) : !nextExpedition ? (
                  <EmptyState
                    size="sm"
                    icon={<Compass size={28} weight="duotone" />}
                    title="No tienes expediciones próximas"
                    description="Cuando reserves una actividad, los detalles de tu próxima expedición aparecerán aquí."
                    action={{ label: "Explorar destinos", onClick: () => router.push("/explorar") }}
                  />
                ) : (
                  <div className="border border-outline-variant/60 rounded-2xl overflow-hidden bg-surface flex flex-col md:flex-row shadow-xs">
                    {/* Image Column */}
                    <div className="md:w-5/12 relative min-h-[220px] md:min-h-full">
                      {nextDestinationImage?.url ? (
                        <Image
                          src={nextDestinationImage.url}
                          alt={nextExpeditionTitle}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
                          <Mountains size={48} className="text-text-muted" aria-hidden="true" />
                        </div>
                      )}
                      {nextDestination?.name && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-inverse-surface/90 backdrop-blur text-oro-indigena text-[10px] font-mono font-bold uppercase tracking-wider">
                          {nextDestination.name}
                        </div>
                      )}
                    </div>

                    {/* Details Column */}
                    <div className="p-6 md:w-7/12 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1.5">
                          <CalendarBlank size={14} />
                          <span>
                            {formatBookingDate(nextExpedition.date)}
                            {typeof nextExpedition.guests === "number"
                              ? ` · ${nextExpedition.guests} ${nextExpedition.guests === 1 ? "persona" : "personas"}`
                              : ""}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-on-surface mb-2">
                          {nextExpeditionTitle}
                        </h3>
                        {nextDestination?.description && (
                          <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                            {nextDestination.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-3 py-3 border-y border-outline-variant/30 text-xs">
                          <div>
                            <span className="text-text-muted uppercase font-mono text-[10px] block">Destino</span>
                            <span className="font-semibold text-on-surface">
                              {nextDestination?.name ?? "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-muted uppercase font-mono text-[10px] block">Estado</span>
                            <span className="font-semibold text-on-surface">{nextStatusLabel}</span>
                          </div>
                          <div>
                            <span className="text-text-muted uppercase font-mono text-[10px] block">Total</span>
                            <span className="font-semibold text-on-surface">
                              {nextExpedition.currency ?? "USD"} {Number(nextExpedition.totalPrice)}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-muted uppercase font-mono text-[10px] block">Confirmación</span>
                            <span className="font-semibold text-on-surface">
                              {nextExpedition.confirmationCode ?? "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                          href="/itinerarios"
                          className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-xs"
                        >
                          <MapTrifold size={16} /> Gestionar Itinerario
                        </Link>
                        <button
                          type="button"
                          onClick={handleDownloadDossier}
                          className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors flex items-center gap-2"
                        >
                          <DownloadSimple size={16} /> Dossier & Voucher PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* ------------------------------------------------------------------- */}
              {/* SECCIÓN C: Lista de Deseos & Destinos Guardados */}
              {/* ------------------------------------------------------------------- */}
              <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 md:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40 mb-6">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest uppercase text-primary font-bold block mb-1">
                      Inspiración Curada
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-on-surface">
                      Destinos en Lista de Deseos
                    </h2>
                  </div>
                  <Link
                    href="/explorar"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    Explorar Catálogo <CaretRight size={14} />
                  </Link>
                </div>

                {favoritesLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Spinner size="lg" />
                  </div>
                ) : favoritesError ? (
                  <EmptyState
                    size="sm"
                    icon={<Heart size={28} weight="duotone" />}
                    title="No pudimos cargar tu lista de deseos"
                    description="Revisa tu conexión e inténtalo de nuevo para ver tus destinos guardados."
                    action={{ label: "Reintentar", onClick: () => void loadFavorites() }}
                  />
                ) : !favorites || favorites.length === 0 ? (
                  <EmptyState
                    size="sm"
                    icon={<Heart size={28} weight="duotone" />}
                    title="Tu lista de deseos está vacía"
                    description="Guarda los destinos que te inspiran para encontrarlos aquí al planificar tu próxima expedición."
                    action={{
                      label: "Explorar destinos",
                      onClick: () => router.push("/explorar"),
                      iconLeft: <MapTrifold size={16} />,
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((fav) => {
                      const dest = fav.destination;
                      const image =
                        dest?.images?.find((i) => i.isHero) ?? dest?.images?.[0] ?? null;
                      return (
                        <Link
                          key={fav.id}
                          href={dest?.slug ? `/explorar/${dest.slug}` : "/explorar"}
                          className="group flex items-center gap-4 p-3 rounded-xl border border-outline-variant/50 bg-surface hover:border-primary/40 transition-colors"
                        >
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-surface-container shrink-0">
                            {image?.url ? (
                              <Image
                                src={image.url}
                                alt={dest?.name ?? "Destino guardado"}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <MapTrifold size={24} className="text-text-muted" aria-hidden="true" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-serif text-base font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                              {dest?.name ?? "Destino guardado"}
                            </h3>
                            {dest?.category?.name && (
                              <p className="text-xs text-text-muted mt-0.5">{dest.category.name}</p>
                            )}
                            {dest?.description && (
                              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mt-1">
                                {dest.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* SIDEBAR COLUMN (4 Columns) */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              {/* Kary IA Concierge Card */}
              <div className="rounded-2xl p-6 bg-volcano-black text-white border border-white/10 shadow-lg relative overflow-hidden">
                <div
                  className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/30 blur-2xl pointer-events-none"
                  aria-hidden="true"
                />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary text-oro-indigena flex items-center justify-center shadow-inner">
                    <Sparkle size={20} weight="fill" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-oro-indigena block">
                      Concierge Algorítmico
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Kary IA Vulcanología
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 mb-5 leading-relaxed">
                  <div className="text-oro-indigena text-[10px] font-mono uppercase tracking-wider mb-1 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-oro-indigena inline-block animate-pulse" />
                    Asistente de Expediciones
                  </div>
                  &quot;¡Hola {user.name}! Soy Kary, tu guía IA. Cuéntame qué tipo de aventura buscas
                  —playa, selva o volcanes— y preparo una propuesta a tu medida con actividades,
                  fechas y presupuesto.&quot;
                </div>

                <button
                  type="button"
                  id="btn-kary-adventure"
                  onClick={handleOpenAiPlan}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkle size={16} /> Generar Nueva Aventura
                </button>
              </div>

              {/* Quick Actions Navigation */}
              <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-on-surface mb-3 pb-2 border-b border-outline-variant/40">
                  Acciones Rápidas del Viajero
                </h3>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href="/explorar"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-xs font-medium text-on-surface group"
                    >
                      <span className="flex items-center gap-3">
                        <Mountains size={18} className="text-primary group-hover:scale-110 transition-transform" />
                        Explorar Nuevos Volcanes
                      </span>
                      <CaretRight size={14} className="text-text-muted" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/itinerarios"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-xs font-medium text-on-surface group"
                    >
                      <span className="flex items-center gap-3">
                        <MapTrifold size={18} className="text-secondary group-hover:scale-110 transition-transform" />
                        Ver Mis Itinerarios Guardados
                      </span>
                      <CaretRight size={14} className="text-text-muted" />
                    </Link>
                  </li>
                  {nextExpedition && (
                    <li>
                      <Link
                        href={`/checkout/${nextExpedition.id}`}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-xs font-medium text-on-surface group"
                      >
                        <span className="flex items-center gap-3">
                          <CreditCard size={18} className="text-tertiary-text group-hover:scale-110 transition-transform" />
                          Completar Pago de mi Reserva
                        </span>
                        <CaretRight size={14} className="text-text-muted" />
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/institucional/contacto"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-xs font-medium text-on-surface group"
                    >
                      <span className="flex items-center gap-3">
                        <Phone size={18} className="text-danger group-hover:scale-110 transition-transform" />
                        Línea de Emergencia & SOS
                      </span>
                      <CaretRight size={14} className="text-text-muted" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Traveler Expedition Profile & Preferences */}
              <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/40">
                  <h3 className="font-serif text-lg font-bold text-on-surface">
                    Perfil de Expedición
                  </h3>
                </div>

                {traveler.profile?.bio || traveler.profile?.phoneNumber ? (
                  <div className="flex flex-col gap-3">
                    {traveler.profile?.bio && (
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {traveler.profile.bio}
                      </p>
                    )}
                    {traveler.profile?.phoneNumber && (
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-text-muted">
                          <Phone size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface">Contacto</span>
                          <span className="text-[11px] text-on-surface-variant">{traveler.profile.phoneNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyState
                    size="sm"
                    icon={<Compass size={28} weight="duotone" />}
                    title="Tu perfil de expedición está vacío"
                    description="Completa tus datos de contacto y preferencias para personalizar tus expediciones."
                  />
                )}
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </div>
  );
}
