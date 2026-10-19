"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Users,
  Flag,
  ShieldCheck,
  LockKey,
  ClockClockwise,
  DownloadSimple,
  Wallet,
  DeviceMobile,
  ArrowLeft,
  ArrowRight,
  Headset,
  SuitcaseSimple,
} from "@phosphor-icons/react";
import { bookingsService } from "@/services/bookings.service";
import type { Booking } from "@/types/booking";
import { Spinner, ErrorState } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

const CANCELLATION_POLICY =
  "Cancelación gratuita hasta 48 horas antes del inicio de la expedición.";

const STATUS_LABELS: Record<Booking["status"], string> = {
  PENDING: "Pendiente de pago",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  REFUNDED: "Reembolsada",
};

/** Fields the API returns but the shared Booking type does not declare yet. */
type BookingDetails = Booking & {
  guests?: number;
  confirmationCode?: string;
};

function ConfirmationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params?.id as string;
  const sessionId = searchParams.get("session_id");
  const { user } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchBooking = useCallback(async () => {
    if (!bookingId) {
      setLoadError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(false);
    try {
      const data = await bookingsService.getById(bookingId);
      setBooking(data);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void fetchBooking();
  }, [fetchBooking]);

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-24 pb-16 px-4">
        <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
        <span className="font-serif italic text-lg text-on-surface">
          Cargando tu confirmación de reserva...
        </span>
      </div>
    );
  }

  if (loadError || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24 px-4">
        <div className="w-full max-w-xl bg-white border border-outline-variant rounded-2xl p-6 shadow-xl">
          <ErrorState
            title="No se pudo cargar la confirmación"
            description="No pudimos cargar el estado de tu reserva. Por favor reintenta o contacta a nuestro equipo de soporte."
            onRetry={() => void fetchBooking()}
          />
        </div>
      </div>
    );
  }

  const details = booking as BookingDetails;
  const isConfirmed = booking.status === "CONFIRMED" || booking.status === "COMPLETED";
  const referenceCode =
    details.confirmationCode ?? `RES-${booking.id.slice(0, 8).toUpperCase()}`;
  const travelerName = user?.name || booking.user?.name || "";
  const travelerEmail = user?.email || booking.user?.email || "";
  const initials = travelerName
    ? travelerName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  const formattedDate = booking.date
    ? new Date(booking.date).toLocaleDateString("es-NI", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Fecha por confirmar";

  const guestsLabel = details.guests
    ? `${details.guests} ${details.guests === 1 ? "viajero" : "viajeros"}`
    : "Por confirmar";

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col justify-between selection:bg-primary selection:text-white">
      {/* Top Security Header */}
      <header className="bg-background/90 backdrop-blur-md border-b border-outline-variant sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Monogram Crest */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 border border-primary/30 flex items-center justify-center bg-white rounded-md transition-colors group-hover:border-primary shadow-xs">
                <span className="font-serif text-xl font-bold text-primary italic">M</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-medium tracking-tight text-primary uppercase block leading-none">
                  Momotombo
                </span>
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-text-muted block mt-1">
                  Travels
                </span>
              </div>
            </Link>

            <div className="hidden md:block h-6 w-px bg-outline-variant" />

            <Link
              href="/itinerarios"
              className="hidden md:inline-flex items-center text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} className="mr-1.5 text-primary" />
              Ir a Mis Itinerarios
            </Link>
          </div>

          {/* Security Protocols */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-secondary-container/50 border border-secondary/40 px-3 py-1.5 rounded-lg">
              <LockKey size={16} weight="fill" className="text-secondary" />
              <span className="text-[11px] font-mono font-semibold uppercase text-secondary tracking-wider">
                Pago seguro con Stripe
              </span>
            </div>

            <div className="flex items-center border border-outline-variant px-3 py-1 text-[11px] font-mono text-on-surface bg-white rounded-lg">
              <span>USD ($)</span>
            </div>

            <div className="w-9 h-9 border border-outline-variant flex items-center justify-center text-primary bg-white rounded-lg shadow-xs">
              <ShieldCheck size={18} weight="fill" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16 w-full flex-grow space-y-12">
        {/* Hero Confirmation Banner */}
        <section className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/40 border border-secondary/40 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-secondary">
              {isConfirmed
                ? "RESERVA CONFIRMADA"
                : "TRANSACCIÓN EN VERIFICACIÓN · PROTOCOLO STRIPE"}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-on-surface">
            {isConfirmed
              ? "Reserva Confirmada & Comprobante Oficial"
              : "Verificación de Pago en Curso"}
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
            {isConfirmed
              ? "Tu reserva está registrada. Conserva este comprobante digital o impreso: contiene tu código de confirmación, con el que tu guía verificará tu reserva el día de la actividad."
              : sessionId
              ? "Estamos verificando la confirmación de la pasarela Stripe para tu reserva. El comprobante se activará tan pronto como el canal bancario registre el pago."
              : "Tu reserva ha sido recibida y se encuentra pendiente del procesamiento del pago. En breve recibirás la actualización por correo electrónico."}
          </p>
        </section>

        {/* Centerpiece: Booking Voucher Card */}
        <section className="bg-white border border-outline-variant rounded-2xl shadow-xl overflow-hidden relative print:border-black print:shadow-none">
          <div className="grid grid-cols-1 lg:grid-cols-10">
            {/* Left Voucher Body (70%) */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-8 lg:border-r border-outline-variant">
              {/* Reference Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-outline-variant">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                    Comprobante de Reserva
                  </p>
                  <p className="font-mono text-lg sm:text-xl text-primary font-bold tracking-wider mt-0.5">
                    {referenceCode}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-secondary-container/60 border border-secondary/40 px-3.5 py-1.5 rounded-lg">
                  <CheckCircle size={16} weight="fill" className="text-secondary" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-secondary">
                    {isConfirmed ? "RESERVA CONFIRMADA" : "PAGO PENDIENTE"}
                  </span>
                </div>
              </div>

              {/* Activity Title & Visual Spread */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                      Expedición en Nicaragua
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-semibold">
                      {booking.activity?.name || "Actividad por confirmar"}
                    </h2>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 bg-surface-container border border-outline-variant text-[11px] font-mono uppercase font-bold text-on-surface-variant rounded">
                    Estado: {STATUS_LABELS[booking.status]}
                  </span>
                </div>

                {/* Panoramic Image Frame */}
                <div className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden border border-outline-variant bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={booking.activity?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdyavk5UWnJ1lR04jBSXZlxQ0kmF3nGUUHpxktcQ7qwmn7BpRzHj20Pp7f9kRHbef90da9zX_SvaIRLnuhzb6dy0bTG3enz9pgvMlJN41GRZxCRlQTaNh0f1ODSmuP_wuOuIczZLunzsts0q3ep_S8YZt8pgIJEMcnCTfOPCgeQ527RdR15noxXCPi1WLRwnP9EZXbo73HyvM_Zz8pGxby9p5VXfFmnMI7g4_sZU4gQDojqWxXNws9H-rUaUz4X3kH2q4v6NVS_dri"}
                    alt={booking.activity?.name || "Expedición en Nicaragua"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-mono tracking-wider uppercase font-medium">
                      {booking.activity?.name || "Expedición en Nicaragua"}
                    </span>
                    <span className="text-[10px] font-mono tracking-wider uppercase bg-primary/90 backdrop-blur-sm px-2.5 py-0.5 border border-white/20 rounded">
                      Aventura
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Details Grid (3 cols, 2 rows) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-outline-variant">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" /> Fecha de la Actividad
                  </p>
                  <p className="text-sm font-semibold text-on-surface">{formattedDate}</p>
                  <span className="text-[11px] font-mono text-secondary font-medium">Fecha reservada</span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" /> Punto de Encuentro
                  </p>
                  <p className="text-sm font-semibold text-on-surface">Por confirmar con tu guía</p>
                  <span className="text-[11px] text-on-surface-variant">Recibirás los detalles antes de la actividad</span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" /> Horario
                  </p>
                  <p className="text-sm font-semibold text-on-surface">Horario por confirmar con tu guía</p>
                  <span className="text-[11px] text-on-surface-variant">Tu guía te contactará con los detalles</span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                    <Users size={14} className="text-primary" /> Viajeros
                  </p>
                  <p className="text-sm font-semibold text-on-surface">{guestsLabel}</p>
                  <span className="text-[11px] font-mono text-on-surface-variant">Personas en la reserva</span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Código de Confirmación</p>
                  <p className="text-sm font-semibold text-primary font-mono">{referenceCode}</p>
                  <span className="text-[11px] text-on-surface-variant">Preséntalo a tu guía el día de la actividad</span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Estado de la Reserva</p>
                  <p className="text-sm font-semibold text-on-surface">{STATUS_LABELS[booking.status]}</p>
                  <span className="text-[11px] text-on-surface-variant">Según el estado de tu pago</span>
                </div>
              </div>

              {/* Expeditioner Identification Pill */}
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                    {initials ?? <Users size={18} weight="bold" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      {travelerName || "Viajero por confirmar"}
                    </p>
                    <p className="text-xs font-mono text-text-muted">
                      {travelerEmail || "Contacto por confirmar"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-secondary font-bold">
                    Estado: {STATUS_LABELS[booking.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Perforated Stub (30%) */}
            <div className="lg:col-span-3 bg-surface-container-low/40 p-6 sm:p-8 flex flex-col justify-between items-center text-center space-y-6 relative border-t lg:border-t-0 border-outline-variant">
              <div className="w-full space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Comprobante</span>
                <h3 className="font-serif text-lg font-semibold text-on-surface">Tu Código de Reserva</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Presenta este código a tu guía el día de la actividad.
                </p>
              </div>

              {/* Confirmation Code Card */}
              <div className="p-6 bg-white border border-outline-variant shadow-xs rounded-xl inline-block w-full">
                <p className="font-mono text-xl tracking-wider text-primary font-bold uppercase">
                  {referenceCode}
                </p>
                <p className="text-[11px] text-text-muted mt-2 uppercase tracking-wider font-mono">
                  Estado: {STATUS_LABELS[booking.status]}
                </p>
              </div>

              {/* Digital Wallet Pills */}
              <div className="w-full space-y-2">
                <button
                  type="button"
                  disabled
                  title="Próximamente"
                  className="w-full bg-volcano-black text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-mono uppercase font-bold opacity-60 cursor-not-allowed"
                >
                  <Wallet size={16} />
                  <span>Añadir a Apple Wallet</span>
                </button>
                <button
                  type="button"
                  disabled
                  title="Próximamente"
                  className="w-full bg-white border border-outline-variant text-on-surface py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-mono uppercase font-bold opacity-60 cursor-not-allowed"
                >
                  <DeviceMobile size={16} className="text-primary" />
                  <span>Añadir a Google Wallet</span>
                </button>
                <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Próximamente</p>
              </div>

              {/* PDF Download Button */}
              <div className="w-full pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="w-full inline-flex items-center justify-center gap-2 text-primary hover:text-primary-hover font-mono text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  <DownloadSimple size={16} />
                  <span>{downloading ? "Preparando..." : "Imprimir o Guardar PDF"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Preparation Protocol & Next Steps */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Próximos Pasos</span>
              <h2 className="font-serif text-2xl font-semibold text-on-surface">
                Cómo Prepararte para tu Expedición
              </h2>
            </div>
            <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span>Fecha de la actividad: {formattedDate}</span>
            </div>
          </div>

          {/* 3-Step Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white border border-outline-variant p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-surface-container text-primary font-bold rounded">
                  PASO 01
                </span>
                <span className="w-7 h-7 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-xs">
                  01
                </span>
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-on-surface">Prepara tu Viaje</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Revisa la ficha de la actividad y prepara el equipo recomendado para la ruta.
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant flex items-center gap-2 text-[11px] font-mono text-text-muted">
                <SuitcaseSimple size={14} className="text-secondary" />
                <span>Consulta la ficha del destino</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-outline-variant p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-surface-container text-primary font-bold rounded">
                  PASO 02
                </span>
                <span className="w-7 h-7 rounded-full bg-surface-container text-text-muted flex items-center justify-center font-bold text-xs">
                  02
                </span>
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-on-surface">Confirma los Detalles</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Tu guía te contactará para confirmar el punto de encuentro y el horario de inicio de la actividad.
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant flex items-center gap-2 text-[11px] font-mono text-text-muted">
                <MapPin size={14} className="text-primary" />
                <span>Horario por confirmar con tu guía</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-outline-variant p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-primary text-white font-bold rounded">
                  PASO 03
                </span>
                <span className="w-7 h-7 rounded-full bg-surface-container text-text-muted flex items-center justify-center font-bold text-xs">
                  03
                </span>
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-on-surface">Día de la Expedición</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Presenta tu código de confirmación a tu guía y disfruta de la experiencia.
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant flex items-center gap-2 text-[11px] font-mono text-text-muted">
                <Flag size={14} className="text-secondary" />
                <span>Comprobante de reserva</span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions & Support Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Primary / Secondary CTAs (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-outline-variant p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Gestión del Viajero</span>
              <h3 className="font-serif text-xl font-semibold text-on-surface">
                ¿Necesitas ajustar tu reserva?
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Nuestro equipo puede ayudarte con dudas sobre la actividad, el punto de encuentro o los requisitos de la expedición.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/itinerarios"
                className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-mono uppercase font-bold tracking-wider rounded-xl transition-colors text-center shadow-xs flex items-center justify-center gap-2"
              >
                <span>Ver Mi Itinerario</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/explorar"
                className="w-full sm:w-auto px-6 py-3.5 border border-on-surface text-on-surface hover:bg-on-surface hover:text-white text-xs font-mono uppercase font-bold tracking-wider rounded-xl transition-colors text-center"
              >
                Explorar Más Destinos
              </Link>
            </div>
          </div>

          {/* 24/7 Support Card (5 cols) */}
          <div className="lg:col-span-5 bg-volcano-black text-white p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-tertiary">
                <Headset size={18} />
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                  Soporte al Viajero 24/7
                </span>
              </div>
              <h3 className="font-serif text-xl text-white font-medium">Mesa de Operaciones Momotombo</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Contacta a nuestro equipo para coordinar detalles de tu reserva o resolver cualquier duda antes de la actividad.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Línea de soporte:</span>
                <span className="font-bold text-tertiary">+505 2249-2760</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Atención al viajero:</span>
                <span className="font-bold text-white">24/7</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Seals */}
        <section className="py-6 border-y border-outline-variant flex flex-wrap items-center justify-around gap-6 opacity-80">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-primary" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface block">Pago Seguro</span>
              <span className="text-[11px] text-text-muted block">Procesado por Stripe</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle size={24} className="text-tertiary-text" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface block">Confirmación Inmediata</span>
              <span className="text-[11px] text-text-muted block">Código de reserva al instante</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ClockClockwise size={24} className="text-secondary" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface block">Cancelación Gratuita</span>
              <span className="text-[11px] text-text-muted block">{CANCELLATION_POLICY}</span>
            </div>
          </div>
        </section>

        {/* Page-level legal links (kept inside main to avoid a duplicate
            contentinfo landmark — the root layout owns the footer) */}
        <section className="pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-mono">
          <p className="text-[11px]">
            © 2026 Momotombo Expeditions S.A.
          </p>
          <nav className="flex flex-wrap justify-center items-center gap-4">
            <Link href="/terminos" className="hover:text-primary transition-colors">
              Términos y Condiciones
            </Link>
            <span>·</span>
            <Link href="/privacidad" className="hover:text-primary transition-colors">
              Política de Privacidad
            </Link>
          </nav>
        </section>
      </main>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center pt-24">
          <Spinner size="xl" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
