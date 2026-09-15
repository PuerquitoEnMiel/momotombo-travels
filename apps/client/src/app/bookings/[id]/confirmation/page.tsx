"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  DownloadSimple,
  ArrowRight,
  Compass,
  ShieldCheck,
  QrCode,
  FileText,
  Clock,
} from "@phosphor-icons/react";
import { bookingsService } from "@/services/bookings.service";
import type { Booking } from "@/types/booking";
import { Spinner, Button, Badge } from "@/components/ui";

export default function BookingConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params?.id as string;
  const sessionId = searchParams.get("session_id");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (bookingId) {
      bookingsService
        .getById(bookingId)
        .then((data) => {
          if (mounted) setBooking(data);
        })
        .catch(() => {
          // Fallback demo state if running detached
          if (mounted) {
            setBooking({
              id: bookingId,
              userId: "user-current",
              activityId: "act-1",
              date: new Date().toISOString().split("T")[0],
              status: "CONFIRMED",
              totalPrice: 120,
              createdAt: new Date().toISOString(),
              activity: {
                id: "act-1",
                name: "Expedición al Cráter y Selva Nubosa",
                price: 120,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141210] flex items-center justify-center pt-20">
        <Spinner size="xl" />
      </div>
    );
  }

  const referenceCode = `MT-${(booking?.id || bookingId || "EXP").slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#141210] text-[#EDE8E3] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-oro-indigena selection:text-volcano-black">
      <div className="max-w-3xl mx-auto">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-selva-esmeralda/10 border border-selva-esmeralda/30 text-selva-esmeralda mb-5">
            <CheckCircle size={36} weight="duotone" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-oro-indigena block mb-2">
            Transacción Completada Con Éxito
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white mb-3">
            Expedición Confirmada
          </h1>
          <p className="text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
            Tu reserva ha sido asegurada en el sistema central de Momotombo Travels. Hemos enviado tu comprobante y detalles logísticos a tu correo.
          </p>
        </motion.div>

        {/* Voucher Ticket */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#1C1A17] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative mb-8"
        >
          {/* Header Strip */}
          <div className="bg-[#24211D] px-6 sm:px-8 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                Código de Comprobante
              </p>
              <p className="text-xl font-mono font-bold text-white tracking-wider">
                {referenceCode}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-selva-esmeralda/15 text-selva-esmeralda border border-selva-esmeralda/30">
                <ShieldCheck size={14} weight="fill" />
                VOUCHER ACTIVO
              </span>
              {sessionId && (
                <span className="text-[10px] font-mono text-stone-400 hidden sm:inline">
                  Stripe ID: {sessionId.slice(0, 10)}...
                </span>
              )}
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/10 pb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-oro-indigena block mb-1">
                Actividad Reservada
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-white font-medium">
                {booking?.activity?.name || "Experiencia Guiada en Nicaragua"}
              </h2>
            </div>

            {/* Grid specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-white/10 pb-6 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-oro-indigena shrink-0">
                  <Calendar size={18} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                    Fecha Programada
                  </p>
                  <p className="font-medium text-white">
                    {booking?.date ? new Date(booking.date).toLocaleDateString("es-NI", { dateStyle: "long" }) : "Fecha a coordinar"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-oro-indigena shrink-0">
                  <Users size={18} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                    Expedicionarios
                  </p>
                  <p className="font-medium text-white">
                    1 persona (Privado)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-oro-indigena shrink-0">
                  <MapPin size={18} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                    Punto de Partida
                  </p>
                  <p className="font-medium text-white">
                    Recepción del Parque / Base Camp
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Summary & QR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-1">
                  Monto Total Abonado
                </p>
                <p className="text-3xl font-mono font-bold text-oro-indigena">
                  ${booking?.totalPrice || 120}.00 <span className="text-xs font-sans font-normal text-stone-400">USD</span>
                </p>
                <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                  <Clock size={12} /> Impuestos locales y seguro de actividad incluidos
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-volcano-black p-1">
                  <QrCode size={48} weight="bold" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-mono font-semibold text-white">Pase Rápido</p>
                  <p className="text-[11px] text-stone-400 max-w-[130px] leading-tight">
                    Muestra este código al guía o guarda en wallet
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-[#161412] px-6 sm:px-8 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <button
              id="btn-download-voucher"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-stone-300 hover:text-white transition-colors"
            >
              <DownloadSimple size={16} /> Imprimir Comprobante Oficial
            </button>

            <div className="flex items-center gap-3">
              <Link
                href="/perfil"
                id="btn-go-to-profile"
                className="px-4 py-2 text-xs font-mono rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors flex items-center gap-1.5"
              >
                <FileText size={14} /> Mis Reservas
              </Link>
              <Link
                href="/explorar"
                id="btn-continue-explore"
                className="px-4 py-2 text-xs font-mono rounded-lg bg-oro-indigena text-volcano-black font-semibold hover:bg-oro-indigena/90 transition-colors flex items-center gap-1.5"
              >
                Seguir Explorando <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Travel Preparation Advice */}
        <div className="bg-[#1C1A17]/60 border border-white/5 rounded-xl p-6 text-xs text-stone-400 space-y-2">
          <p className="font-mono text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass size={14} className="text-oro-indigena" />
            Protocolo de Preparación para la Expedición
          </p>
          <ul className="list-disc list-inside space-y-1 text-stone-400 leading-relaxed">
            <li>Llega con al menos 15 minutos de anticipación al punto de encuentro acordado con tu guía certificado.</li>
            <li>Usa calzado de tracción cerrado y ropa transpirable apta para microclimas volcánicos o selva.</li>
            <li>En caso de modificaciones climáticas, el equipo de operaciones te contactará vía WhatsApp o llamada directa.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
