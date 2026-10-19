"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldStar,
  LockKey,
  LockSimple,
  Tag,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Check,
  Calendar,
  User,
  Car,
  FirstAidKit,
  Mountains,
  Receipt,
  ClockClockwise,
  Headset,
  SealCheck,
} from "@phosphor-icons/react";
import { bookingsService } from "@/services/bookings.service";
import { api } from "@/services/api";
import { API_URL } from "@/lib/api";
import { formatMoney } from "@/lib/money";
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

export default function CheckoutPage() {
  const params = useParams();
  const { user } = useAuth();
  const bookingId = params?.bookingId as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Por favor ingresa un código de cortesía.");
      return;
    }
    try {
      const result = await api.post<{ discount: number }>(
        `${API_URL}/coupons/validate`,
        { code, purchaseAmount: booking?.totalPrice ?? 0 }
      );
      setDiscountAmount(result.discount);
      setCouponApplied(true);
    } catch (error) {
      setCouponApplied(false);
      setDiscountAmount(0);
      setCouponError(
        error instanceof Error ? error.message : "Código inválido o caducado."
      );
    }
  };

  const handleProceedToPayment = async () => {
    setProcessing(true);
    try {
      const session = await bookingsService.createCheckoutSession(
        bookingId,
        couponApplied ? couponCode.trim().toUpperCase() : undefined
      );
      if (session?.url) {
        window.location.href = session.url;
      } else {
        setCouponError("No se pudo iniciar la sesión de Stripe. Intenta nuevamente.");
      }
    } catch (error) {
      setCouponError(
        error instanceof Error ? error.message : "Error al conectar con la pasarela de pagos."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-24 pb-16 px-4">
        <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
        <span className="font-serif italic text-lg text-on-surface">
          Cargando los detalles de tu reserva...
        </span>
      </div>
    );
  }

  if (loadError || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24 px-4">
        <div className="w-full max-w-xl bg-white border border-outline-variant rounded-2xl p-6 shadow-xl">
          <ErrorState
            title="No se pudo cargar la reserva"
            description="No pudimos cargar los detalles de tu reserva. Comprueba tu conexión o contacta a nuestro equipo de soporte."
            onRetry={() => void fetchBooking()}
          />
        </div>
      </div>
    );
  }

  const details = booking as BookingDetails;
  // booking.totalPrice is the payable total (already net of any coupon applied
  // server-side). Never add fees on top of it and never subtract the coupon twice.
  const payableTotal = booking.totalPrice;

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
  const reservationCode =
    details.confirmationCode ?? `RES-${booking.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary">
      {/* Top Security & Navigation Header */}
      <header className="bg-background/90 backdrop-blur-md sticky top-0 z-40 border-b border-outline-variant shadow-xs transition-all">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Brand Monogram */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border border-primary/30 flex items-center justify-center bg-white rounded-md transition-colors group-hover:border-primary shadow-xs">
              <span className="font-serif text-xl font-bold text-primary italic">M</span>
            </div>
            <div>
              <span className="font-serif text-lg font-medium tracking-tight text-primary uppercase block leading-none">
                Momotombo Travels
              </span>
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-text-muted block mt-1">
                Expeditions &amp; Sanctuary
              </span>
            </div>
          </Link>

          {/* Trailing Security Badges */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-secondary-container/40 border border-secondary/30 rounded-lg">
              <LockKey size={16} weight="fill" className="text-secondary" />
              <span className="text-[11px] font-mono font-semibold uppercase text-secondary tracking-wider">
                Pago seguro con Stripe
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-on-surface-variant px-2.5 py-1 border border-outline-variant rounded-lg bg-white">
              <span>USD ($)</span>
            </div>

            <Link
              href="/explorar"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors group"
            >
              <ArrowLeft size={16} className="text-primary transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden md:inline">Volver al Itinerario</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-14">
        {/* Hero Section & Stepper */}
        <section className="mb-10 lg:mb-12">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-white border border-outline-variant rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">
                PASO FINAL · PAGO SEGURO
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-on-surface">
              Finalizar Reserva de Expedición &amp; Pago Seguro
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
              Completa el pago para confirmar tu reserva. Recibirás el código de confirmación
              y podrás coordinar el punto de encuentro y el horario con tu guía.
            </p>
          </div>

          {/* Stepper Component */}
          <div className="border border-outline-variant bg-white p-5 md:p-6 shadow-sm rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 relative">
              {/* Step 1: Completed */}
              <div className="flex items-center gap-3.5 relative">
                <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Check size={18} weight="bold" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-text-muted">Paso 01</span>
                  <span className="block text-sm font-semibold text-on-surface">Selección de Ruta</span>
                </div>
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-outline-variant" />
              </div>

              {/* Step 2: Completed */}
              <div className="flex items-center gap-3.5 relative">
                <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Check size={18} weight="bold" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-text-muted">Paso 02</span>
                  <span className="block text-sm font-semibold text-on-surface">Detalles &amp; Logística</span>
                </div>
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-outline-variant" />
              </div>

              {/* Step 3: Active */}
              <div className="flex items-center gap-3.5 bg-surface-container-low px-4 py-2.5 rounded-lg border border-primary/20">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <LockSimple size={18} weight="fill" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-primary font-bold">Paso 03 · Activo</span>
                  <span className="block text-sm font-semibold text-primary">Confirmación &amp; Pago</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetric 7:5 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Expedition Operational File & Trust Matrix (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Card A: Ficha Operativa */}
            <article className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
              {/* Panoramic Image Frame */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.activity?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvEtolAPWJFPu18I_m24pqBJT0vijhYageyOwwelWq4yn2HT-01DHwgHF8OVBW2z_mdrrlIP8j4H9dpqSuWtU9lfFAekk9UPs6_bV16XPbf3nfZEpPOX55sg6r-Q6KZCvxgNF90dFuQdm9BgYqNgyQ1bCN3ogGvEl7A1OhebD96yH4xAsWeJZH-cgIrNS2RlakLhOXrSX4YXRZk6bkXraW9Y4Z_YJSutXFgSvA-lKewIOD3m1X2ggDhJFhU_11OZoP3GKSXvr62Zd"}
                  alt={booking.activity?.name || "Expedición en Nicaragua"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-primary font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg shadow-xs">
                    REF: NICA-OMT-{booking.id.slice(-4).toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-primary text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg shadow-xs">
                    {details.guests ? `Viajeros: ${details.guests}` : "Viajeros por confirmar"}
                  </span>
                </div>

                {/* Bottom Content Title */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary-container block mb-1">
                    Expedición en Nicaragua
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl text-white font-medium leading-snug drop-shadow-sm">
                    {booking.activity?.name || "Actividad por confirmar"}
                  </h2>
                </div>
              </div>

              {/* Metadata Strip */}
              <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary shrink-0" />
                  <span className="text-xs font-semibold text-on-surface">
                    {booking.date ? new Date(booking.date).toLocaleDateString("es-NI", { dateStyle: "long" }) : "Fecha por confirmar"}
                  </span>
                  <span className="text-xs text-text-muted font-mono">
                    ({booking.activity?.durationHours ? `${booking.activity.durationHours} Horas` : "Duración por confirmar"})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-surface-container border border-outline-variant text-on-surface-variant text-[10px] font-mono font-bold uppercase rounded">
                    Estado: {STATUS_LABELS[booking.status]}
                  </span>
                </div>
              </div>

              {/* Included Services Checklist */}
              <div className="p-6 md:p-8 space-y-6">
                <h3 className="font-serif text-lg font-medium text-on-surface">
                  Tu Reserva Incluye
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3.5 bg-surface-container-low/60 rounded-xl border border-outline-variant/60">
                    <User size={22} weight="fill" className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wide">Guía Local</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        Acompañamiento de guías locales durante toda la actividad.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-surface-container-low/60 rounded-xl border border-outline-variant/60">
                    <Car size={22} weight="fill" className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wide">Transporte Terrestre</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        Traslados desde el punto de encuentro hasta el inicio de la ruta.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-surface-container-low/60 rounded-xl border border-outline-variant/60">
                    <FirstAidKit size={22} weight="fill" className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wide">Seguridad en Ruta</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        Equipo básico de primeros auxilios y protocolo de contacto de emergencia.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-surface-container-low/60 rounded-xl border border-outline-variant/60">
                    <Mountains size={22} weight="fill" className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wide">Equipo Técnico</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        El equipo necesario para la actividad según la ficha del destino.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lead Expeditioner Pill */}
                <div className="pt-4 border-t border-outline-variant">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                        {initials ?? <User size={18} weight="bold" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
                          Titular de la Reserva
                        </span>
                        <span className="text-sm font-bold text-on-surface block">
                          {travelerName || "Viajero por confirmar"}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {travelerEmail || "Contacto por confirmar"}
                        </span>
                      </div>
                    </div>
                    <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-outline-variant">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
                        Código de Confirmación
                      </span>
                      <span className="text-xs font-mono font-semibold text-on-surface block">
                        {reservationCode}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary mt-0.5">
                        <CheckCircle size={14} weight="fill" /> Estado: {STATUS_LABELS[booking.status]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Card B: Garantías & Pasarela Segura */}
            <article className="bg-white border border-outline-variant p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-medium text-on-surface">
                    Pago Seguro &amp; Transparencia
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Tu pago se procesa a través de Stripe. El total mostrado es el precio final de tu reserva.
                  </p>
                </div>

                {/* Payment Brands */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 font-mono text-xs font-bold bg-[#635bff] text-white rounded tracking-wide shadow-xs">
                    stripe
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-surface-container text-on-surface rounded border border-outline-variant">
                    VISA
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-surface-container text-on-surface rounded border border-outline-variant">
                    MC
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-surface-container text-on-surface rounded border border-outline-variant">
                    AMEX
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-semibold bg-surface-container text-on-surface rounded border border-outline-variant">
                    Apple Pay
                  </span>
                </div>
              </div>

              {/* Trust Badges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-surface-container-low border border-outline-variant/60 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldStar size={18} weight="fill" className="text-secondary" />
                    <span className="text-[11px] font-mono font-bold text-on-surface">PAGO SEGURO</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Procesado por Stripe, certificado PCI DSS Nivel 1. No almacenamos números de tarjeta.
                  </p>
                </div>

                <div className="p-4 bg-surface-container-low border border-outline-variant/60 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt size={18} weight="fill" className="text-secondary" />
                    <span className="text-[11px] font-mono font-bold text-on-surface">SIN CARGOS OCULTOS</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    El total mostrado en esta página es el precio final de tu reserva.
                  </p>
                </div>

                <div className="p-4 bg-surface-container-low border border-outline-variant/60 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockClockwise size={18} weight="fill" className="text-secondary" />
                    <span className="text-[11px] font-mono font-bold text-on-surface">CANCELACIÓN GRATUITA</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {CANCELLATION_POLICY}
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column: Financial Breakdown & Payment Drawer (5 Cols) */}
          <div className="lg:col-span-5">
            <aside className="sticky top-28 bg-white border border-outline-variant rounded-2xl shadow-xl overflow-hidden">
              {/* Header of Drawer */}
              <div className="p-6 md:p-7 border-b border-outline-variant bg-surface-container-low">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block mb-1">
                  Resumen de Reserva
                </span>
                <h3 className="font-serif text-xl font-medium text-on-surface">
                  Desglose Financiero
                </h3>
              </div>

              {/* Itemized Breakdown */}
              <div className="p-6 md:p-7 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-sm font-semibold text-on-surface block">
                      Tarifa de Expedición
                    </span>
                    <span className="text-xs text-text-muted block mt-0.5">
                      {details.guests
                        ? `Precio total de la reserva para ${details.guests} ${details.guests === 1 ? "viajero" : "viajeros"}`
                        : "Precio total de la reserva"}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-on-surface whitespace-nowrap">
                    {formatMoney(payableTotal)}
                  </span>
                </div>

                {/* Interactive Coupon Form */}
                <div className="pt-4 pb-2 border-t border-outline-variant">
                  <label htmlFor="coupon-input" className="block text-[11px] font-mono uppercase tracking-wider text-text-muted mb-2">
                    Código de Cortesía / Credencial Diplomática
                  </label>
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="relative flex items-center">
                      <input
                        id="coupon-input"
                        type="text"
                        placeholder="Ej. MOMOTOMBO10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-white border border-outline-variant text-on-surface font-mono text-xs uppercase px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 pr-24"
                      />
                      <button
                        type="submit"
                        id="btn-apply-coupon"
                        className="absolute right-1 px-3 py-1.5 bg-primary text-white rounded text-[11px] font-mono font-semibold uppercase hover:bg-primary-hover transition-colors"
                      >
                        {couponApplied ? "Actualizar" : "Aplicar"}
                      </button>
                    </div>

                    {couponApplied && (
                      <div className="px-3 py-2 bg-secondary-container/40 rounded-lg text-secondary border border-secondary/30">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono font-semibold flex items-center gap-1.5">
                            <Tag size={14} weight="bold" /> Cupón aplicado
                          </span>
                          <span className="font-mono text-xs font-bold">-{formatMoney(discountAmount)}</span>
                        </div>
                        <p className="text-[11px] mt-1 text-secondary">
                          El descuento ya está incluido en el total de tu reserva.
                        </p>
                      </div>
                    )}

                    {couponError && (
                      <p className="text-xs text-sunset-orange font-mono mt-1">
                        {couponError}
                      </p>
                    )}
                  </form>
                </div>

                {/* Grand Total Display */}
                <div className="bg-surface-container p-5 rounded-xl border border-outline-variant mt-4 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Total a Pagar</span>
                    <div className="text-right">
                      <span className="font-serif text-3xl font-bold text-primary leading-none">
                        {formatMoney(payableTotal)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted text-right">
                    Total final de la reserva. No se aplican cargos adicionales.
                  </p>
                </div>

                {/* Primary Checkout CTA Button */}
                <div className="pt-4">
                  <button
                    id="stripe-checkout-btn"
                    type="button"
                    onClick={handleProceedToPayment}
                    disabled={processing}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-4 px-6 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer"
                  >
                    {processing ? (
                      <>
                        <Spinner size="sm" />
                        <span>Conectando con la Pasarela Cifrada...</span>
                      </>
                    ) : (
                      <>
                        <LockSimple size={18} weight="fill" />
                        <span>Proceder al Pago Seguro con Stripe</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Micro-Copy */}
                <div className="pt-2 text-center">
                  <p className="text-xs text-text-muted leading-relaxed flex items-center justify-center gap-1.5">
                    <SealCheck size={16} weight="fill" className="text-secondary shrink-0" />
                    <span>Pago procesado por Stripe Inc. Momotombo Travels no almacena números de tarjeta.</span>
                  </p>
                </div>
              </div>

              {/* Bottom Security Status Strip */}
              <div className="px-6 py-3 bg-surface-container-high border-t border-outline-variant flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  Conexión segura con el servidor de pagos
                </span>
                <span>HTTPS / TLS</span>
              </div>
            </aside>
          </div>
        </div>

        {/* Page-level trust strip & legal links (kept inside main to avoid a
            duplicate contentinfo landmark — the root layout owns the footer) */}
        <section className="mt-16 border-t border-outline-variant pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Headset size={16} className="text-secondary" />
              <span className="text-xs font-mono text-text-muted">
                Soporte al viajero 24/7: +505 2249-2760
              </span>
            </div>
            <nav className="flex flex-wrap justify-center items-center gap-5 text-xs font-mono text-text-muted">
              <Link href="/terminos" className="hover:text-primary transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="/privacidad" className="hover:text-primary transition-colors">
                Política de Privacidad
              </Link>
            </nav>
          </div>
        </section>
      </main>
    </div>
  );
}
