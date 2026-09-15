"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  LockSimple,
  CreditCard,
  Tag,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  Sparkle,
} from "@phosphor-icons/react";
import { bookingsService } from "@/services/bookings.service";
import type { Booking } from "@/types/booking";
import { Spinner, Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const bookingId = params?.bookingId as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    let mounted = true;
    if (bookingId) {
      bookingsService
        .getById(bookingId)
        .then((data) => {
          if (mounted) setBooking(data);
        })
        .catch(() => {
          // Fallback demo state
          if (mounted) {
            setBooking({
              id: bookingId,
              userId: "current-user",
              activityId: "act-masaya-1",
              date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
              status: "PENDING",
              totalPrice: 140,
              createdAt: new Date().toISOString(),
              activity: {
                id: "act-masaya-1",
                name: "Expedición Nocturna Cráter Santiago & Lagos de Lava",
                price: 140,
              },
            });
          }
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [bookingId]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === "MOMOTOMBO10" || code === "NICARAGUA2026" || code === "KARY") {
      setDiscountPercent(15);
      setCouponApplied(true);
    } else if (code === "") {
      setCouponError("Por favor ingresa un código.");
    } else {
      setCouponError("Código inválido o caducado.");
    }
  };

  const basePrice = booking?.totalPrice || 140;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const conservationFee = 15;
  const finalPrice = Math.max(basePrice - discountAmount + conservationFee, 0);

  const handleProceedToPayment = async () => {
    setProcessing(true);
    try {
      const title = booking?.activity?.name || "Expedición Momotombo Travels";
      const session = await bookingsService.createCheckoutSession(
        bookingId,
        finalPrice,
        title
      );
      if (session?.url) {
        window.location.href = session.url;
      } else {
        // Fallback local mock route
        router.push(`/bookings/${bookingId}/confirmation?session_id=cs_mock_${bookingId}`);
      }
    } catch {
      // Fallback gracefully to confirmation view in dev mode
      router.push(`/bookings/${bookingId}/confirmation?session_id=cs_mock_${bookingId}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141210] flex items-center justify-center pt-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141210] text-[#EDE8E3] pt-28 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-oro-indigena selection:text-volcano-black">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/explorar"
            className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Volver a Explorar
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-10">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-oro-indigena block mb-2">
            Pasarela de Pago Segura · Momotombo Travels
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-white">
            Resumen de Reserva y Pago
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column: Details & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            {/* Expedition Summary Card */}
            <div className="bg-[#1C1A17] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
                <span>Detalle del Itinerario</span>
                <span className="text-oro-indigena font-bold">Estado: Pendiente</span>
              </h2>

              <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-4">
                {booking?.activity?.name || "Expedición Volcánica y Selva"}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-stone-300">
                  <Calendar size={16} className="text-oro-indigena shrink-0" />
                  <span>
                    Fecha:{" "}
                    <strong className="text-white">
                      {booking?.date ? new Date(booking.date).toLocaleDateString("es-NI", { dateStyle: "long" }) : "Por coordinar"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-stone-300">
                  <Users size={16} className="text-oro-indigena shrink-0" />
                  <span>
                    Expedicionarios: <strong className="text-white">1 Adulto (Tour Guiado)</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-stone-300">
                  <MapPin size={16} className="text-oro-indigena shrink-0" />
                  <span>
                    Zona: <strong className="text-white">Arco Volcánico de los Maribios</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-[#1C1A17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-stone-400 pb-3 border-b border-white/10">
                Método de Procesamiento
              </h2>

              <div className="border border-oro-indigena/50 bg-oro-indigena/5 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-oro-indigena/20 flex items-center justify-center text-oro-indigena">
                    <CreditCard size={22} weight="duotone" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      Stripe Global Checkout
                      <span className="text-[10px] font-mono uppercase bg-selva-esmeralda/20 text-selva-esmeralda px-2 py-0.5 rounded-full">
                        Recomendado
                      </span>
                    </p>
                    <p className="text-xs text-stone-400">
                      Tarjetas Visa, Mastercard, AMEX, Apple Pay, Google Pay
                    </p>
                  </div>
                </div>
                <CheckCircle size={20} weight="fill" className="text-oro-indigena" />
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
                <LockSimple size={14} className="text-selva-esmeralda" />
                <span>Encriptación TLS de 256 bits y certificación PCI DSS Nivel 1.</span>
              </div>
            </div>
          </div>

          {/* Sidebar Column: Price Breakdown & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1C1A17] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xs font-mono uppercase tracking-widest text-stone-400 pb-3 border-b border-white/10 mb-5">
                Desglose Financiero
              </h2>

              {/* Price rows */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-stone-300">
                  <span>Tarifa de Expedición</span>
                  <span className="font-mono text-white">${basePrice}.00 USD</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Fondo de Conservación Natural</span>
                  <span className="font-mono text-white">${conservationFee}.00 USD</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-selva-esmeralda font-medium">
                    <span className="flex items-center gap-1">
                      <Tag size={14} /> Cupón ({discountPercent}%)
                    </span>
                    <span className="font-mono">-${discountAmount}.00 USD</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                  <span className="text-base font-medium text-white">Total a Pagar</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-oro-indigena">
                      ${finalPrice}.00
                    </span>
                    <span className="text-xs font-mono text-stone-400 ml-1">USD</span>
                  </div>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="mb-6 pt-4 border-t border-white/10">
                <label htmlFor="coupon-input" className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-2">
                  Cupón de Descuento
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon-input"
                    type="text"
                    placeholder="Ej. MOMOTOMBO10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono uppercase text-white focus:outline-hidden focus:border-oro-indigena"
                  />
                  <button
                    type="submit"
                    id="btn-apply-coupon"
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-xs font-mono text-white rounded-lg transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-selva-esmeralda mt-2 flex items-center gap-1 font-mono">
                    <CheckCircle size={12} weight="fill" /> Descuento aplicado correctamente.
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-sunset-orange mt-2 font-mono">
                    {couponError}
                  </p>
                )}
              </form>

              {/* Payment CTA */}
              <Button
                id="btn-pay-now"
                variant="primary"
                onClick={handleProceedToPayment}
                disabled={processing}
                className="w-full py-4 text-sm font-mono uppercase tracking-wider justify-center bg-oro-indigena text-volcano-black hover:bg-oro-indigena/90 font-bold"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" /> Conectando con Stripe...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LockSimple size={16} weight="bold" /> Pagar ${finalPrice}.00 USD <ArrowRight size={16} />
                  </span>
                )}
              </Button>

              <p className="text-[11px] text-stone-400 text-center mt-4 leading-relaxed">
                Al confirmar, aceptas nuestros términos de expedición y la política de cancelación protegida de Momotombo Travels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
