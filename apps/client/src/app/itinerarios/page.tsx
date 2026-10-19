"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass,
  Mountains,
  Compass,
  Trophy,
  Medal,
  DownloadSimple,
  ShareNetwork,
  MapTrifold,
  Clock,
  CheckCircle,
  ArrowRight,
  Eye,
  Wind,
  ShieldCheck,
  Sparkle,
  AirplaneTakeoff,
  House,
  Wine,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { API_URL, getAuthToken } from "@/lib/api";
import { Badge, Container } from "@/components/ui";
import { gamificationService, type GamificationData } from "@/services/gamification.service";



interface ServerItinerary {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  days?: Array<{ id: string; dayNumber: number; activities?: unknown[] }>;
  createdAt?: string;
}

interface CuratedItinerary {
  id: string;
  title: string;
  location: string;
  status: "DRAFT" | "CONFIRMED" | "COMPLETED";
  statusLabel: string;
  duration?: string;
  activitiesCount: number;
  difficulty: string;
  progress?: number;
  description?: string;
  image: string;
  logistics?: string[];
  badgeEarned?: string;
}

const FEATURED_EXPEDITION = {
  id: "exp-ometepe-01",
  code: "NICA-OMT-882",
  title: "Expedición Volcán Maderas & Santuario de Aguas Termales",
  subtitle: "Travesía Lacustre & Cráteres Nubosos",
  dates: "18 - 22 Noviembre 2025 (5 Días / 4 Noches)",
  location: "Reserva de Biósfera Isla de Ometepe · Volcanes Concepción & Maderas",
  image:
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
  route: ["Managua Heliport", "Granada Colonial", "Volcán Masaya Nocturno", "Laguna Maderas"],
  tags: [
    { label: "Vuelo Helicóptero H130", icon: AirplaneTakeoff },
    { label: "Villa Privada de Teca", icon: House },
    { label: "Cata Centenario", icon: Wine },
  ],
};

const CURATED_SAMPLE_ITINERARIES: CuratedItinerary[] = [
  {
    id: "sample-cerro-negro",
    title: "Travesía del Fuego y Ceniza: Cerro Negro & Telica Nocturno",
    location: "León & Cordillera de los Maribios",
    status: "DRAFT",
    statusLabel: "Borrador IA · En Edición",
    duration: "4 Días",
    activitiesCount: 7,
    difficulty: "Exigente / Alta",
    progress: 85,
    description:
      "Ascenso a cráteres activos con sandboarding sobre magma petrificado y pernocta con vulcanólogos en estación sismológica.",
    image:
      "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80",
    logistics: ["Campamento de Altura", "Equipo Térmico Certificado", "Monitoreo Sismológico"],
  },
  {
    id: "sample-granada-colonial",
    title: "Ruta Colonial & Sabores del Cacao: Granada, Masaya & Catarina",
    location: "Granada Señorial & Masaya",
    status: "CONFIRMED",
    statusLabel: "Confirmada",
    duration: "3 Días",
    activitiesCount: 5,
    difficulty: "Relajado / Cultural",
    description:
      "Inmersión íntima en arquitectura mudéjar colonial, talleres de hamacas finas y mirador lacustre sobre la Laguna de Apoyo.",
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    logistics: [
      "Transporte Privado 4x4 con Concierge",
      "Casona Señorial S. XVI (Patrimonio Exclusivo)",
      "Cata Privada de Ron & Cacao Criollo",
    ],
  },
  {
    id: "sample-costa-esmeralda",
    title: "Santuario del Pacífico: Playas Vírgenes de Tola & Surf Volcánico",
    location: "Costa Esmeralda · Tola",
    status: "COMPLETED",
    statusLabel: "Completada · Ene 2025",
    duration: "6 Días",
    activitiesCount: 8,
    difficulty: "Océano & Litoral",
    description:
      "Pensión frente a arrecifes volcánicos, navegación privada en catamarán al atardecer y liberación de tortugas paslama.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    logistics: ["Villas Frente al Mar", "Catamarán Privado", "Santuario de Tortugas"],
    badgeEarned: "Guardián de la Costa Pacífica",
  },
];

export default function ItinerariesDashboard() {
  const router = useRouter();
  const [serverItineraries, setServerItineraries] = useState<ServerItinerary[]>([]);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "DRAFT" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "duration">("date");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetch(`${API_URL}/itineraries`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setServerItineraries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    gamificationService
      .me()
      .then(setGamification)
      .catch(() => setGamification(null));
  }, [router]);

  // User-created itineraries only. Sample previews render in their own
  // "Ejemplos" section, never mixed with real data.
  const allItineraries = useMemo(() => {
    return serverItineraries.map((it) => ({
      id: it.id,
      title: it.title,
      location: "Nicaragua · Ruta Personalizada",
      status: (it.status === "CONFIRMED"
        ? "CONFIRMED"
        : it.status === "COMPLETED"
          ? "COMPLETED"
          : "DRAFT") as "DRAFT" | "CONFIRMED" | "COMPLETED",
      statusLabel:
        it.status === "CONFIRMED"
          ? "Confirmada"
          : it.status === "COMPLETED"
            ? "Completada"
            : "Borrador · En Edición",
      duration: it.days?.length ? `${it.days.length} Días` : undefined,
      activitiesCount: it.days?.reduce((acc, d) => acc + (d.activities?.length || 0), 0) ?? 0,
      difficulty: "Personalizado",
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      progress: undefined as number | undefined,
      badgeEarned: undefined as string | undefined,
      logistics: undefined as string[] | undefined,
      description: undefined as string | undefined,
    }));
  }, [serverItineraries]);

  const statusCounts = useMemo(
    () => ({
      CONFIRMED: allItineraries.filter((it) => it.status === "CONFIRMED").length,
      DRAFT: allItineraries.filter((it) => it.status === "DRAFT").length,
      COMPLETED: allItineraries.filter((it) => it.status === "COMPLETED").length,
    }),
    [allItineraries]
  );

  const totalDays = useMemo(
    () => serverItineraries.reduce((acc, it) => acc + (it.days?.length || 0), 0),
    [serverItineraries]
  );

  // Filtered & Searched Itineraries
  const filteredItineraries = useMemo(() => {
    return allItineraries.filter((it) => {
      const matchesFilter = filter === "ALL" ? true : it.status === filter;
      const matchesSearch =
        it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allItineraries, filter, searchQuery]);

  const handleOpenAiPlanner = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-chat"));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-medium text-sm animate-pulse">
            Sincronizando bitácora de expediciones...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION / EXPEDITIONS HEADER */}
      {/* ========================================================================= */}
      <section className="bg-surface-container-high border-b border-outline-variant/40 pt-10 pb-8 relative overflow-hidden">
        {/* Subtle Topographic Ambient Texture */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 30%, rgba(138,56,36,0.15) 0%, transparent 40%), radial-gradient(circle at 85% 70%, rgba(30,59,47,0.15) 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />

        <Container size="lg" className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant/40">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-lowest/80 rounded-full border border-outline-variant/50 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                  CORDÓN VOLCÁNICO DEL PACÍFICO · BITÁCORA PRIVADA
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary tracking-tight">
                Bitácora de Expediciones &amp; Rutas Privadas
              </h1>
              <p className="text-on-surface-variant text-base md:text-lg font-light leading-relaxed">
                Gestiona, refina y comparte tus travesías a través de la cordillera volcánica y las ciudades patrimoniales de Nicaragua.
              </p>
            </div>

            {/* Primary Action CTA */}
            <div className="shrink-0">
              <Link
                href="/planificar"
                id="btn-create-itinerary-top"
                className="group inline-flex items-center gap-3 px-6 h-12 bg-primary hover:bg-primary-hover text-on-primary rounded-xl font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
              >
                <Sparkle size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                <span>Diseñar Nueva Ruta con Kary IA</span>
              </Link>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2">
            {/* Filter Pills Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filter === "ALL"
                    ? "bg-secondary text-on-secondary shadow-xs"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40"
                }`}
              >
                Todas las Expediciones ({allItineraries.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("CONFIRMED")}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filter === "CONFIRMED"
                    ? "bg-secondary text-on-secondary shadow-xs"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40"
                }`}
              >
                Confirmadas &amp; Activas ({statusCounts.CONFIRMED})
              </button>
              <button
                type="button"
                onClick={() => setFilter("DRAFT")}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filter === "DRAFT"
                    ? "bg-secondary text-on-secondary shadow-xs"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40"
                }`}
              >
                Borradores de Planificación ({statusCounts.DRAFT})
              </button>
              <button
                type="button"
                onClick={() => setFilter("COMPLETED")}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filter === "COMPLETED"
                    ? "bg-secondary text-on-secondary shadow-xs"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40"
                }`}
              >
                Completadas ({statusCounts.COMPLETED})
              </button>
            </div>

            {/* Search Bar and Sorter Dropdown */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <div className="relative w-full sm:w-72">
                <span className="absolute inset-y-0 left-3 flex items-center text-text-muted pointer-events-none">
                  <MagnifyingGlass size={18} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por destino o actividad..."
                  className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-hidden"
                />
              </div>

              <div className="relative min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "duration")}
                  className="w-full h-10 pl-3 pr-8 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none outline-hidden cursor-pointer"
                >
                  <option value="date">Ordenar por: Fecha de Salida</option>
                  <option value="duration">Ordenar por: Duración</option>
                </select>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. METRICS & FIELD LOGISTICS BAR (3 Column Luxury Cards) */}
      {/* ========================================================================= */}
      <section className="py-8">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted">Estado Operativo</span>
                  <h2 className="text-xs font-bold text-on-surface-variant mt-1">
                    Expediciones en Curso / Próximas
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <Mountains size={22} weight="duotone" />
                </div>
              </div>
              <div className="mt-4">
                <div className="font-serif text-2xl font-bold text-primary">
                  {statusCounts.CONFIRMED} {statusCounts.CONFIRMED === 1 ? "Ruta Activa" : "Rutas Activas"}
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Itinerarios con estado confirmado en tu bitácora personal.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted">Densidad de Travesía</span>
                  <h2 className="text-xs font-bold text-on-surface-variant mt-1">Días Totales en Ruta</h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary-container/60 flex items-center justify-center text-secondary">
                  <Compass size={22} weight="duotone" />
                </div>
              </div>
              <div className="mt-4">
                <div className="font-serif text-2xl font-bold text-on-surface">{totalDays} Días</div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Suma de los días planificados en tus itinerarios guardados.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-tertiary-text">Puntos &amp; Medallas</span>
                  <h2 className="text-xs font-bold text-on-surface-variant mt-1">Prestigio y Recompensas</h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary-text">
                  <Trophy size={22} weight="duotone" />
                </div>
              </div>
              <div className="mt-4">
                {gamification ? (
                  <>
                    <div className="font-serif text-2xl font-bold text-tertiary-text">
                      {gamification.points} XP
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      {gamification.earnedBadges.length} Medallas ganadas · {gamification.availableBadges.length} por
                      desbloquear.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="font-serif text-2xl font-bold text-tertiary-text">Sin datos aún</div>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Tus puntos y medallas aparecerán aquí a medida que completes itinerarios.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRIMARY CONTENT: FEATURED ACTIVE EXPEDITION (Hero Panoramic Card) */}
      {/* ========================================================================= */}
      <section className="py-4">
        <Container size="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass size={20} className="text-primary" weight="fill" />
              <h2 className="font-serif text-xl font-bold text-on-surface">
                Ejemplo de Expedición
              </h2>
              <Badge variant="warning">Ejemplo</Badge>
            </div>
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
              Código de Misión: {FEATURED_EXPEDITION.code}
            </span>
          </div>

          <div className="relative bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/60 shadow-md group hover:shadow-xl transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
              {/* Panoramic Image Block (8 cols) */}
              <div className="lg:col-span-8 relative min-h-[280px] lg:min-h-full overflow-hidden">
                <Image
                  src={FEATURED_EXPEDITION.image}
                  alt={FEATURED_EXPEDITION.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-inverse-surface/30 lg:to-inverse-surface/90" />

                {/* Sample Content Marker (not a live status) */}
                <div className="absolute top-6 left-6 inline-flex items-center gap-2.5 px-4 py-2 bg-inverse-surface/90 backdrop-blur-md rounded-full border border-white/20 shadow-md">
                  <span className="font-mono text-xs text-white tracking-widest uppercase font-bold">
                    Ejemplo · Vista Previa
                  </span>
                </div>

                {/* Inset Image Metadata Strip */}
                <div className="absolute bottom-6 left-6 right-6 lg:right-auto text-white max-w-md">
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-md mb-2 font-mono text-xs tracking-wider uppercase font-semibold">
                    {FEATURED_EXPEDITION.dates}
                  </div>
                  <p className="text-xs text-white/90 drop-shadow">
                    {FEATURED_EXPEDITION.location}
                  </p>
                </div>
              </div>

              {/* Narrative & Logistics Panel (4 cols) */}
              <div className="lg:col-span-4 p-6 md:p-8 flex flex-col justify-between bg-surface-container-low border-t lg:border-t-0 lg:border-l border-outline-variant/40">
                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                      {FEATURED_EXPEDITION.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-on-surface mt-1 leading-snug">
                      {FEATURED_EXPEDITION.title}
                    </h3>
                  </div>

                  {/* Route Path Stepper Flow */}
                  <div className="space-y-2 pt-2 border-t border-outline-variant/40">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                      Itinerario de Vuelo y Tránsito
                    </div>
                    <div className="flex items-center text-xs text-on-surface-variant flex-wrap gap-y-1.5 gap-x-2">
                      <span className="text-on-surface font-semibold">{FEATURED_EXPEDITION.route[0]}</span>
                      <span className="text-primary font-bold">→</span>
                      <span>{FEATURED_EXPEDITION.route[1]}</span>
                      <span className="text-primary font-bold">→</span>
                      <span>{FEATURED_EXPEDITION.route[2]}</span>
                      <span className="text-primary font-bold">→</span>
                      <span className="text-primary font-bold">{FEATURED_EXPEDITION.route[3]}</span>
                    </div>
                  </div>

                  {/* Curated Logistics Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {FEATURED_EXPEDITION.tags.map((tag, idx) => {
                      const IconC = tag.icon;
                      return (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-surface-container rounded-lg text-xs text-on-surface-variant border border-outline-variant/50 flex items-center gap-1.5 font-medium"
                        >
                          <IconC size={14} className="text-primary" /> {tag.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Action CTAs Cluster */}
                <div className="space-y-3 pt-8">
                  <Link
                    href="/planificar"
                    className="w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs tracking-wide rounded-xl shadow-md transition-all duration-200"
                  >
                    <span>Diseñar una Ruta Similar</span>
                    <ArrowRight size={16} />
                  </Link>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => toast.info("Próximamente")}
                      className="flex items-center justify-center gap-1.5 h-10 px-3 bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/60 text-xs font-semibold rounded-xl transition-colors"
                    >
                      <DownloadSimple size={14} />
                      <span>Voucher PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.info("Próximamente")}
                      className="flex items-center justify-center gap-1.5 h-10 px-3 bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/60 text-xs font-semibold rounded-xl transition-colors"
                    >
                      <ShareNetwork size={14} />
                      <span>Compartir Ruta</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. ASYMMETRIC GRID: CURATED ITINERARIES (3 Columns) */}
      {/* ========================================================================= */}
      <section className="py-10">
        <Container size="lg" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-outline-variant/40 pb-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Tus Itinerarios Curados &amp; Archivo de Expediciones
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Itinerarios guardados en tu cuenta, listos para editar o compartir.
              </p>
            </div>
            <span className="text-xs font-mono text-text-muted">
              {filteredItineraries.length} Rutas Listadas
            </span>
          </div>

          {filteredItineraries.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant/50 shadow-xs">
              <MapTrifold size={40} className="text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-on-surface mb-2">
                No se encontraron expediciones
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto mb-6">
                No hay rutas que coincidan con los filtros aplicados. Puedes diseñar una nueva con el concierge de IA.
              </p>
              <Link
                href="/planificar"
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-xs hover:bg-primary-hover inline-block"
              >
                Comenzar a planificar
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredItineraries.map((it) => (
                  <motion.article
                    key={it.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/50 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="relative h-56 bg-inverse-surface overflow-hidden">
                        <Image
                          src={it.image}
                          alt={it.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-black/20" />

                        {/* Status Tag */}
                        <div className="absolute top-4 right-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold shadow-xs ${
                              it.status === "CONFIRMED"
                                ? "bg-secondary text-on-secondary"
                                : it.status === "COMPLETED"
                                  ? "bg-surface-container-high text-on-surface"
                                  : "bg-tertiary-container/80 text-on-tertiary-container"
                            }`}
                          >
                            {it.status === "CONFIRMED" && <CheckCircle size={12} weight="fill" />}
                            {it.status === "DRAFT" && <Clock size={12} />}
                            {it.status === "COMPLETED" && <CheckCircle size={12} />}
                            <span>{it.statusLabel}</span>
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 text-white">
                          <span className="font-mono text-xs uppercase tracking-wider text-oro-indigena font-semibold">
                            {it.location}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <h3 className="font-serif text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                          {it.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                          {it.duration && (
                            <>
                              <span className="flex items-center gap-1">
                                <Clock size={14} /> {it.duration}
                              </span>
                              <span>·</span>
                            </>
                          )}
                          <span>{it.activitiesCount} actividades</span>
                          <span>·</span>
                          <span className="text-primary font-semibold">{it.difficulty}</span>
                        </div>

                        {/* Progress Bar (if draft) */}
                        {it.progress && it.status === "DRAFT" && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-text-muted uppercase">Completitud del Dossier</span>
                              <span className="text-primary font-bold">{it.progress}% planificado</span>
                            </div>
                            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full transition-all duration-500"
                                style={{ width: `${it.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Earned Badge (if completed) */}
                        {it.badgeEarned && (
                          <div className="p-3 bg-tertiary-container/15 rounded-xl border border-oro-indigena/30 flex items-center gap-3">
                            <Medal size={22} weight="duotone" className="text-tertiary-text shrink-0" />
                            <div>
                              <span className="font-mono text-[10px] uppercase tracking-wider text-tertiary-text font-bold block">
                                Medalla Desbloqueada
                              </span>
                              <span className="text-xs font-semibold text-on-surface">
                                {it.badgeEarned}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Logistics Tags (if confirmed) */}
                        {it.status === "CONFIRMED" && it.logistics && (
                          <div className="space-y-1.5 pt-1">
                            {it.logistics.map((log: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-on-surface">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>{log}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {it.description && (
                          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                            {it.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="p-6 pt-0 flex items-center justify-between border-t border-outline-variant/40 mt-4">
                      <Link
                        href={`/planificar/${it.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:gap-2.5 transition-all"
                      >
                        <span>
                          {it.status === "DRAFT"
                            ? "Continuar Editando con IA"
                            : it.status === "COMPLETED"
                              ? "Revivir Cuaderno de Ruta"
                              : "Ver Itinerario Completo"}
                        </span>
                        <ArrowRight size={14} />
                      </Link>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/itinerarios/${it.id}/compartir`}
                          className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg"
                          title="Compartir"
                          aria-label="Compartir"
                        >
                          <ShareNetwork size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toast.info("Próximamente")}
                          className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg"
                          title="Descargar PDF"
                          aria-label="Descargar PDF"
                        >
                          <DownloadSimple size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. SAMPLE ITINERARIES (Clearly labeled demo content) */}
      {/* ========================================================================= */}
      <section className="pb-10">
        <Container size="lg" className="space-y-6">
          <div className="border-b border-outline-variant/40 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Ejemplos de Itinerarios
              </h2>
              <Badge variant="warning">Ejemplo</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Contenido de demostración para inspirarte. No son rutas reales ni reservables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CURATED_SAMPLE_ITINERARIES.map((it) => (
              <SampleItineraryCard key={it.id} it={it} />
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 6. AI CONCIERGE ROUTE OPTIMIZATION BOX (Basalt + Magma Glow) */}
      {/* ========================================================================= */}
      <section className="py-6 pb-16">
        <Container size="lg">
          <div className="relative rounded-2xl overflow-hidden bg-volcano-black text-white p-8 md:p-10 border border-white/10 shadow-xl">
            {/* Magma Radial Atmosphere Glow */}
            <div
              className="absolute -top-32 -right-32 w-96 h-96 bg-primary/30 rounded-full blur-[90px] pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-32 -left-32 w-80 h-80 bg-oro-indigena/20 rounded-full blur-[80px] pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Concierge Avatar & Message */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary text-oro-indigena flex items-center justify-center shadow-md">
                    <Sparkle size={24} weight="fill" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-widest text-oro-indigena font-bold">
                      CONCIERGE ALGORÍTMICO · KARY IA
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Ventana de Oportunidad Geofísica Detectada
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
                  Kary IA detectó una ventana microclimática óptima y baja sismicidad para el ascenso al cráter del Volcán Masaya durante tu próxima estancia en Granada. ¿Deseas sincronizar la caminata nocturna con telescopio térmico de infrarrojos?
                </p>

                {/* Quick Telemetry Tags */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-white/90 flex items-center gap-1.5 font-mono">
                    <Wind size={14} className="text-oro-indigena" /> Viento: 14 km/h ENE
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-white/90 flex items-center gap-1.5 font-mono">
                    <Eye size={14} className="text-secondary-container" /> Visibilidad: 98%
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-white/90 flex items-center gap-1.5 font-mono">
                    <ShieldCheck size={14} className="text-emerald-400" /> Gases: Nivel 1 Seguro
                  </span>
                </div>
              </div>

              {/* Right: Action Button Trigger */}
              <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-2.5">
                <button
                  type="button"
                  id="btn-optimize-kary"
                  onClick={handleOpenAiPlanner}
                  className="w-full sm:w-auto lg:w-full px-6 py-3.5 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs tracking-wide rounded-xl shadow-lg transition-all duration-200 text-center"
                >
                  Optimizar Itinerario con Kary IA
                </button>
                <span className="text-[11px] font-mono text-white/60 tracking-tight text-center w-full">
                  Sin costo añadido · Valida reservas al instante
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function SampleItineraryCard({ it }: { it: CuratedItinerary }) {
  return (
    <article className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/50 shadow-xs flex flex-col justify-between">
      <div>
        <div className="relative h-56 bg-inverse-surface overflow-hidden">
          <Image src={it.image} alt={it.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-black/20" />

          <div className="absolute top-4 right-4">
            <Badge variant="warning">Ejemplo</Badge>
          </div>

          <div className="absolute bottom-4 left-4 text-white">
            <span className="font-mono text-xs uppercase tracking-wider text-white/90 font-semibold">
              {it.location}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-on-surface leading-snug">{it.title}</h3>

          <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
            {it.duration && (
              <>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {it.duration}
                </span>
                <span>·</span>
              </>
            )}
            <span>{it.activitiesCount} actividades</span>
            <span>·</span>
            <span className="text-primary font-semibold">{it.difficulty}</span>
          </div>

          {it.description && (
            <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{it.description}</p>
          )}

          {it.logistics && (
            <div className="space-y-1.5 pt-1">
              {it.logistics.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-outline-variant/40 mt-4">
        <Link
          href="/planificar"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:gap-2.5 transition-all"
        >
          <span>Crear un itinerario similar</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
