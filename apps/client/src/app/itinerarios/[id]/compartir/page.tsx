"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  ShareNetwork,
  Calendar,
  MapPin,
  Clock,
  Sparkle,
  ArrowRight,
  Copy,
  CheckCircle,
  CurrencyDollar,
  AirplaneTakeoff,
  Users,
} from "@phosphor-icons/react";
import { itinerariesService } from "@/services/itineraries.service";
import type { Itinerary } from "@/types/itinerary";
import { Spinner, Button, Badge } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

export default function SharedItineraryPage() {
  const params = useParams();
  const id = params?.id as string;
  const toast = useToast();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (id) {
      itinerariesService
        .getById(id)
        .then((data) => {
          if (mounted) setItinerary(data);
        })
        .catch(() => {
          // Graceful fallback demo itinerary
          if (mounted) {
            setItinerary({
              id,
              userId: "traveler-shared",
              title: "Travesía por los Volcanes de Fuego & Lagos de Nicaragua",
              status: "CONFIRMED",
              days: [
                {
                  id: "day-1",
                  dayNumber: 1,
                  itineraryId: id,
                  items: [
                    {
                      id: "item-1",
                      itineraryDayId: "day-1",
                      order: 1,
                      notes: "Ascenso por ladera de arena volcánica y descenso a 60 km/h.",
                      activity: {
                        id: "act-cerro",
                        name: "Sandboarding extremo en Volcán Cerro Negro",
                        duration: 3,
                        price: 45,
                      },
                    },
                    {
                      id: "item-2",
                      itineraryDayId: "day-1",
                      order: 2,
                      notes: "Paseo al atardecer sobre las cúpulas blancas barrocas.",
                      activity: {
                        id: "act-leon",
                        name: "Recorrido por la Catedral Insigne de León",
                        duration: 2,
                        price: 15,
                      },
                    },
                  ],
                },
                {
                  id: "day-2",
                  dayNumber: 2,
                  itineraryId: id,
                  items: [
                    {
                      id: "item-3",
                      itineraryDayId: "day-2",
                      order: 1,
                      notes: "Exploración de la boca incandescente del cráter Santiago.",
                      activity: {
                        id: "act-masaya",
                        name: "Expedición Nocturna al Volcán Masaya",
                        duration: 4,
                        price: 60,
                      },
                    },
                  ],
                },
                {
                  id: "day-3",
                  dayNumber: 3,
                  itineraryId: id,
                  items: [
                    {
                      id: "item-4",
                      itineraryDayId: "day-3",
                      order: 1,
                      notes: "Navegación lacustre entre dos volcanes gemelos.",
                      activity: {
                        id: "act-ometepe",
                        name: "Llegada al Santuario Natural Isla de Ometepe",
                        duration: 5,
                        price: 75,
                      },
                    },
                  ],
                },
              ],
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
  }, [id]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Enlace de itinerario copiado al portapapeles");
      setTimeout(() => setCopied(false), 2500);
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
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-oro-indigena/10 text-oro-indigena border border-oro-indigena/30 mb-4">
            <ShareNetwork size={14} /> Itinerario Compartido
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white mb-4">
            {itinerary?.title || "Expedición Personalizada en Nicaragua"}
          </h1>
          <p className="text-sm text-stone-400 max-w-2xl leading-relaxed">
            Diseñado en la plataforma Momotombo Travels con asistencia de inteligencia artificial y curaduría vulcanológica local.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-stone-300">
              <Calendar size={14} className="text-oro-indigena" />
              {itinerary?.days?.length || 3} Días de Ruta
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-stone-300">
              <MapPin size={14} className="text-oro-indigena" />
              Ruta Volcánica Nicaragua
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-stone-300">
              <Sparkle size={14} className="text-oro-indigena" />
              Curaduría IA (Kary)
            </span>
          </div>
        </motion.div>

        {/* Action Header Card */}
        <div className="bg-[#1C1A17] border border-white/10 rounded-2xl p-4 sm:p-6 mb-10 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-selva-esmeralda/20 text-selva-esmeralda flex items-center justify-center">
              <AirplaneTakeoff size={20} weight="duotone" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-white">¿Te gusta este plan de viaje?</p>
              <p className="text-xs text-stone-400">Puedes personalizar tu propio itinerario en segundos.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="btn-copy-share-url"
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-white transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <CheckCircle size={14} weight="fill" className="text-selva-esmeralda" /> : <Copy size={14} />}
              {copied ? "¡Copiado!" : "Copiar Enlace"}
            </button>

            <Link
              href="/planificar"
              id="btn-create-my-own"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-oro-indigena text-volcano-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-oro-indigena/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkle size={14} weight="fill" /> Planificar El Mío
            </Link>
          </div>
        </div>

        {/* Days Progression */}
        <div className="space-y-8">
          {itinerary?.days?.map((day) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#1C1A17] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
            >
              {/* Day marker */}
              <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-serif text-oro-indigena font-light">
                    Día 0{day.dayNumber}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                    · Expedición y Actividades
                  </span>
                </div>
                <span className="text-xs font-mono text-stone-500">
                  {day.items?.length || 0} Paradas
                </span>
              </div>

              {/* Items in the day */}
              <div className="space-y-4">
                {day.items?.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-oro-indigena/10 text-oro-indigena flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {item.activity?.name || "Actividad Exploratoria"}
                        </h4>
                        {item.notes && (
                          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-stone-400 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                      {item.activity?.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-oro-indigena" />
                          {item.activity.duration}h
                        </span>
                      )}
                      {item.activity?.price && (
                        <span className="flex items-center gap-1 text-white font-bold">
                          ${item.activity.price} USD
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
