"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CalendarBlank,
  Trophy,
  Medal,
  SignOut,
  NotePencil,
  Camera,
  Sparkle,
  CreditCard,
  Phone,
  FirstAid,
  CaretRight,
  SealCheck,
  CheckCircle,
  Lock,
  DownloadSimple,
  ShareNetwork,
  MapTrifold,
  Mountains,
  Compass,
  Check,
  Headset,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner, ErrorState, Container } from "@/components/ui";

// Mock Fallback Expeditions for Wishlist & Active Booking
const ACTIVE_EXPEDITION = {
  id: "exp-ometepe-01",
  title: "Expedición Volcán Maderas & Santuario de Aguas Termales",
  dates: "18 - 22 Noviembre 2025 (5 Días / 4 Noches)",
  tag: "Vuelo H130 Charter",
  description:
    "Ascenso a la laguna cratérica de niebla con descenso hacia los manantiales termales de Ojo de Agua y hospedaje en villa boutique de teca sobre el dosel selvático.",
  guide: "Dr. Carlos Marenco (Geólogo Senior INETER)",
  transport: "Helicóptero H130 + Yate Cocibolca",
  status: "Confirmado / Pago Completado",
  image:
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
};

const WISHLIST_ITEMS = [
  {
    id: "wish-granada",
    title: "Granada Colonial: Mansiones & Patios del S. XVI",
    tag: "Colonial S. XVI",
    description:
      "Inmersión histórica en residencias virreinales privadas y degustación de cacao criollo ancestral.",
    duration: "4 Días / 3 Noches",
    price: 1850,
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    slug: "granada-colonial",
  },
  {
    id: "wish-esmeralda",
    title: "Costa Esmeralda: Villas Sobre el Acantilado",
    tag: "Pacífico Exclusivo",
    description:
      "Playa virgen de arena dorada, olas de clase mundial, spas volcánicos y navegación al atardecer.",
    duration: "6 Días / 5 Noches",
    price: 3100,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    slug: "costa-esmeralda",
  },
  {
    id: "wish-sanctuary",
    title: "Sanctuary Teak Retreat: Dosel Selvático",
    tag: "Eco-Lodge Lujo",
    description:
      "Refugio en maderas nobles nativas, avistamiento privado de tucanes y tinas de roca volcánica.",
    duration: "5 Días / 4 Noches",
    price: 2400,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    slug: "sanctuary-teak-retreat",
  },
];

const DEFAULT_BADGES = [
  {
    id: "cerro-negro",
    name: "Conquistador del Cerro Negro",
    description: "Sandboarding extremo y descenso de piroclastos a 728 msnm con traje térmico.",
    unlocked: true,
    completedDate: "12 Abr 2024",
    xp: 650,
    icon: Mountains,
  },
  {
    id: "mombacho",
    name: "Guardián Selva Mombacho",
    description: "Exploración del bosque nuboso, identificación de orquídeas y sendero El Puma.",
    unlocked: true,
    completedDate: "29 Ago 2024",
    xp: 450,
    icon: Compass,
  },
  {
    id: "granada",
    name: "Historiador de Granada",
    description: "Ruta del s. XVI: Patios señoriales, Iglesia La Merced y archivos coloniales.",
    unlocked: true,
    completedDate: "15 Ene 2025",
    xp: 500,
    icon: Medal,
  },
  {
    id: "ometepe",
    name: "Navegante de Ometepe",
    description: "Travesía privada en catamarán por el Gran Lago Cocibolca hacia el Istmo de Istián.",
    unlocked: true,
    completedDate: "04 Mar 2025",
    xp: 400,
    icon: MapTrifold,
  },
  {
    id: "masaya",
    name: "Pionero Nocturno Masaya",
    description: "Observación térmica del Cráter Santiago y visualización directa del lago de lava.",
    unlocked: true,
    completedDate: "18 Jun 2024",
    xp: 300,
    icon: Sparkle,
  },
  {
    id: "telica",
    name: "Fumarola Telica",
    description: "Requiere campamento nocturno de cráter a 1,061m y registro sismológico en vivo.",
    unlocked: false,
    completedDate: "Próximo desbloqueo",
    xp: 750,
    icon: Lock,
  },
  {
    id: "somoto",
    name: "Expedicionario Cañón de Somoto",
    description: "Descenso de gargantas milenarias de roca volcánica y nado en aguas subterráneas.",
    unlocked: false,
    completedDate: "Próximo desbloqueo",
    xp: 600,
    icon: Lock,
  },
];

export default function PerfilPage() {
  const { t: _t } = useTranslation("profile");
  const router = useRouter();
  const { user, gamification, loading, error, logout } = useAuth();
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

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

  const currentPoints = gamification?.points ?? 1850;
  const nextThreshold = gamification?.nextLevelThreshold ?? 2500;
  const userLevel = gamification?.level ?? 4;
  const progressPercentage = Math.min((currentPoints / nextThreshold) * 100, 100);
  const xpRemaining = Math.max(nextThreshold - currentPoints, 0);

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

  // Filtered badges
  const filteredBadges = DEFAULT_BADGES.filter((b) => {
    if (badgeFilter === "unlocked") return b.unlocked;
    if (badgeFilter === "locked") return !b.unlocked;
    return true;
  });

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
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
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

                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-2 bg-surface-container-lowest text-on-surface rounded-full shadow-md border border-outline-variant/60 hover:border-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary"
                  title="Cambiar foto de credencial"
                  aria-label="Cambiar foto de credencial"
                >
                  <Camera size={14} />
                </button>

                <div
                  className="absolute -top-2 -left-2 bg-inverse-surface text-oro-indigena p-1.5 rounded-full shadow-sm border border-oro-indigena/40"
                  title="Expedicionaria Certificada INETER"
                >
                  <SealCheck size={18} weight="fill" />
                </div>
              </div>

              {/* Bio & Diplomatic Status */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-tertiary-container/20 border border-oro-indigena/40 text-on-tertiary-container font-mono text-xs uppercase font-bold tracking-wider">
                    <SealCheck size={12} weight="fill" /> INETER CERTIFICADA
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                    <CalendarBlank size={12} /> Miembro desde Marzo 2023
                  </span>
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
                  <MapPin size={16} className="text-primary" />
                  <span>
                    Residencia Base: <strong className="text-on-surface font-semibold">Managua & Volcán Masaya, Nicaragua</strong>
                  </span>
                  <span className="text-outline-variant">·</span>
                  <span className="text-xs text-on-surface-variant">{user.email}</span>
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="px-2.5 py-1 rounded bg-surface-container font-mono text-xs tracking-wider uppercase text-on-surface-variant border border-outline-variant/40">
                    Pasaporte Diplomático N° EXP-NIC-8824
                  </span>
                  <span className="text-xs text-secondary font-semibold flex items-center gap-1">
                    <FirstAid size={14} /> Póliza VIP Volcánica
                  </span>
                </div>
              </div>
            </div>

            {/* Gamification Level & XP Pass Widget */}
            <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-5 shadow-sm min-w-[320px] max-w-md w-full">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-outline block">
                    Prestigio de Campo
                  </span>
                  <span className="font-serif text-xl font-bold text-primary">
                    Nivel {userLevel}: Explorador Mayor
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
                    Meta Nivel {userLevel + 1}: {nextThreshold} XP
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-primary-container to-oro-indigena rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant text-right mt-1 font-medium">
                  {xpRemaining} XP restantes para &quot;Maestro de Magma&quot;
                </p>
              </div>

              {/* XP Breakdown Chips */}
              <div className="mt-3 pt-3 border-t border-outline-variant/40 grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant font-medium">
                <div className="flex items-center gap-1">
                  <span className="text-secondary font-bold">+650 XP</span> Ascenso Cerro Negro
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-secondary font-bold">+500 XP</span> Granada Colonial
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-secondary font-bold">+400 XP</span> Travesía Ometepe
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-secondary font-bold">+300 XP</span> Foco Lago Masaya
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between gap-2">
                <button
                  type="button"
                  id="btn-edit-profile"
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border border-outline-variant text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
                >
                  <NotePencil size={14} /> Editar Perfil
                </button>
                <button
                  type="button"
                  id="btn-share-passport"
                  onClick={handleSharePassport}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copiedLink ? <Check size={14} /> : <ShareNetwork size={14} />}
                  {copiedLink ? "¡Copiado!" : "Pasaporte Lacre"}
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
      {/* 2. METRICS BAR (4 Columns) */}
      {/* ========================================================================= */}
      <section className="relative z-20 -mt-6">
        <Container size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest border border-outline-variant/60 p-5 rounded-xl shadow-xs flex items-center gap-4 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <Compass size={24} weight="duotone" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-on-surface leading-none block">6</span>
                <span className="text-[11px] font-mono tracking-wider uppercase text-outline mt-1 block">
                  Lugares Explorados
                </span>
                <span className="text-xs text-secondary font-semibold">Volcanes & Ciudades</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/60 p-5 rounded-xl shadow-xs flex items-center gap-4 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-oro-indigena">
                <Sparkle size={24} weight="duotone" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-on-surface leading-none block">4</span>
                <span className="text-[11px] font-mono tracking-wider uppercase text-outline mt-1 block">
                  Rutas Creadas IA
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Curadas por Kary IA</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/60 p-5 rounded-xl shadow-xs flex items-center gap-4 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <Medal size={24} weight="duotone" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-on-surface leading-none block">
                  {gamification?.earnedBadges.length || 7} / 15
                </span>
                <span className="text-[11px] font-mono tracking-wider uppercase text-outline mt-1 block">
                  Medallas Desbloqueadas
                </span>
                <span className="text-xs text-primary font-semibold">47% del Catálogo</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/60 p-5 rounded-xl shadow-xs flex items-center gap-4 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                <NotePencil size={24} weight="duotone" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-on-surface leading-none block">5</span>
                <span className="text-[11px] font-mono tracking-wider uppercase text-outline mt-1 block">
                  Reseñas Verificadas
                </span>
                <span className="text-xs text-secondary font-semibold">Con Guía Geólogo</span>
              </div>
            </div>
          </div>
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
                      Todas (7)
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
                      Desbloqueadas (5)
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
                      Pendientes (2)
                    </button>
                  </div>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {filteredBadges.map((badge) => {
                      const IconComponent = badge.icon;
                      return (
                        <motion.div
                          key={badge.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                            badge.unlocked
                              ? "bg-surface border-outline-variant/50 hover:border-oro-indigena/60 hover:shadow-sm"
                              : "bg-surface-container/40 border-dashed border-outline-variant/80 opacity-75"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-2.5">
                              <div
                                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xs ${
                                  badge.unlocked
                                    ? "bg-gradient-to-br from-oro-indigena to-primary text-nica-white"
                                    : "bg-surface-container-highest text-outline"
                                }`}
                              >
                                <IconComponent size={20} weight={badge.unlocked ? "fill" : "regular"} />
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`text-[10px] font-mono uppercase font-bold ${
                                      badge.unlocked ? "text-secondary" : "text-outline"
                                    }`}
                                  >
                                    {badge.unlocked ? "Desbloqueada" : "Bloqueada"}
                                  </span>
                                  {badge.unlocked && <CheckCircle size={12} className="text-secondary" weight="fill" />}
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

                          <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
                            <span>{badge.completedDate}</span>
                            <span className="font-bold text-primary">+{badge.xp} XP</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold w-fit">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                    {ACTIVE_EXPEDITION.status}
                  </span>
                </div>

                {/* Editorial Feature Card */}
                <div className="border border-outline-variant/60 rounded-2xl overflow-hidden bg-surface flex flex-col md:flex-row shadow-xs">
                  {/* Image Column */}
                  <div className="md:w-5/12 relative min-h-[220px] md:min-h-full">
                    <Image
                      src={ACTIVE_EXPEDITION.image}
                      alt={ACTIVE_EXPEDITION.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-inverse-surface/90 backdrop-blur text-oro-indigena text-[10px] font-mono font-bold uppercase tracking-wider">
                      {ACTIVE_EXPEDITION.tag}
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="p-6 md:w-7/12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1.5">
                        <CalendarBlank size={14} />
                        <span>{ACTIVE_EXPEDITION.dates}</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-on-surface mb-2">
                        {ACTIVE_EXPEDITION.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                        {ACTIVE_EXPEDITION.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 py-3 border-y border-outline-variant/30 text-xs">
                        <div>
                          <span className="text-outline uppercase font-mono text-[10px] block">Guía Geólogo</span>
                          <span className="font-semibold text-on-surface">{ACTIVE_EXPEDITION.guide}</span>
                        </div>
                        <div>
                          <span className="text-outline uppercase font-mono text-[10px] block">Transporte Exclusivo</span>
                          <span className="font-semibold text-on-surface">{ACTIVE_EXPEDITION.transport}</span>
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
                        onClick={() => alert("Dossier & Voucher PDF descargado")}
                        className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors flex items-center gap-2"
                      >
                        <DownloadSimple size={16} /> Dossier & Voucher PDF
                      </button>
                    </div>
                  </div>
                </div>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {WISHLIST_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-xl border border-outline-variant/50 bg-surface overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
                    >
                      <div>
                        <div className="relative h-44 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-inverse-surface/85 backdrop-blur text-surface text-[10px] font-mono font-bold uppercase">
                            {item.tag}
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-serif text-base font-bold text-on-surface mb-1 leading-snug line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-outline border-t border-outline-variant/30 pt-2 font-medium">
                            <span>{item.duration}</span>
                            <span className="text-on-surface font-bold text-sm">
                              ${item.price} <span className="text-[10px] text-outline font-normal">/pax</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <Link
                          href={`/explorar/${item.slug}`}
                          className="w-full py-2 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/40"
                        >
                          <Headset size={14} /> Reservar con Concierge
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
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
                    Recomendación Exclusiva
                  </div>
                  &quot;¡Hola {user.name}! Basado en tu <strong>Nivel {userLevel} de Explorador Mayor</strong> y tu ascenso previo al Cerro Negro, he preparado una expedición a las fumarolas del <strong>Volcán Telica</strong> con pernocta astronómica y registro sismológico en tiempo real.&quot;
                </div>

                <div className="space-y-2 mb-5 text-xs text-white/70">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span>Dificultad Estimada</span>
                    <span className="text-oro-indigena font-semibold">Media-Alta (8.5 km)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span>Recompensa de Campo</span>
                    <span className="text-emerald-400 font-semibold">+750 XP + Medalla Telica</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Guía Requerido</span>
                    <span className="text-white font-medium">Vulcanólogo Certificado</span>
                  </div>
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
                      <CaretRight size={14} className="text-outline" />
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
                      <CaretRight size={14} className="text-outline" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/checkout/exp-ometepe-01"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-xs font-medium text-on-surface group"
                    >
                      <span className="flex items-center gap-3">
                        <CreditCard size={18} className="text-oro-indigena group-hover:scale-110 transition-transform" />
                        Gestionar Métodos de Pago
                      </span>
                      <CaretRight size={14} className="text-outline" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/institucional/contacto"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-xs font-medium text-on-surface group"
                    >
                      <span className="flex items-center gap-3">
                        <Phone size={18} className="text-danger group-hover:scale-110 transition-transform" />
                        Línea Satelital 24/7 & SOS
                      </span>
                      <CaretRight size={14} className="text-outline" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Traveler Expedition Profile & Badges */}
              <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/40">
                  <h3 className="font-serif text-lg font-bold text-on-surface">
                    Perfil de Expedición
                  </h3>
                  <button type="button" className="text-xs font-semibold text-primary hover:underline">
                    Configurar
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-semibold flex items-center gap-1.5">
                    <Mountains size={14} /> Montañismo Exigente
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-medium border border-outline-variant/40 flex items-center gap-1.5">
                    <Sparkle size={14} className="text-primary" /> Cacao Criollo & Café
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-medium border border-outline-variant/40 flex items-center gap-1.5">
                    <Compass size={14} className="text-oro-indigena" /> Eco-Lodges de Lujo
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-tertiary-container/20 text-on-tertiary-container border border-oro-indigena/50 text-xs font-semibold flex items-center gap-1.5">
                    <SealCheck size={14} weight="fill" /> Contacto SOS Verificado
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-outline">
                    <Phone size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">Base Operativa Managua INETER</span>
                    <span className="text-[11px] text-on-surface-variant">+505 2249-2760 · Frecuencia VHF 144.200</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </div>
  );
}
