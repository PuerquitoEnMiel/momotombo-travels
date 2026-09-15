"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  Clock,
  Users,
  CurrencyDollar,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Sparkle,
  PlusCircle,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { destinationsService } from "@/services/destinations.service";
import type { Destination } from "@/types/destination";
import { Spinner, Button } from "@/components/ui";

export default function NuevaActividadPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [price, setPrice] = useState(45);
  const [duration, setDuration] = useState(4);
  const [maxGroupSize, setMaxGroupSize] = useState(8);
  const [difficulty, setDifficulty] = useState("MODERADO");
  const [description, setDescription] = useState("");
  const [included, setIncluded] = useState<string[]>([
    "Guía Local Certificado",
    "Seguro de Expedición",
  ]);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "GUIDE" && user.role !== "ADMIN"))) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    destinationsService
      .list()
      .then((data) => {
        setDestinations(data);
        if (data.length > 0) setDestinationId(data[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingDestinations(false));
  }, []);

  const toggleIncluded = (item: string) => {
    setIncluded((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Simulate API submission / registration
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Experiencia turística publicada correctamente");
      router.push("/proveedores");
    } catch {
      toast.error("Error al publicar la actividad");
    } finally {
      setSubmitting(false);
    }
  };

  const amenitiesList = [
    "Guía Local Certificado",
    "Transporte 4x4 Dedicado",
    "Seguro de Expedición",
    "Equipo Técnico (Cascos / Bastones)",
    "Hidratación & Bocadillos Tradicionales",
    "Entradas a Parques Nacionales",
  ];

  if (authLoading || loadingDestinations) {
    return (
      <div className="min-h-screen bg-[#141210] flex items-center justify-center pt-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141210] text-[#EDE8E3] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/proveedores"
            className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Volver al Portal de Guías
          </Link>
        </div>

        <div className="mb-8">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-oro-indigena block mb-2">
            Registro de Experiencias · Red de Anfitriones
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-white">
            Publicar Nueva Experiencia
          </h1>
          <p className="text-sm text-stone-400 mt-2">
            Configura una nueva ruta, tour de senderismo o taller cultural para viajeros nacionales e internacionales.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1C1A17] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-2">
              Nombre de la Experiencia / Tour
            </label>
            <input
              required
              type="text"
              placeholder="Ej. Ascenso al Cráter Activo y Sandboarding al Atardecer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-400 focus:outline-hidden focus:border-oro-indigena"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-2">
                Destino Base Asociado
              </label>
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full bg-[#24211D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-oro-indigena"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.category?.name || "Destino"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-2">
                Nivel de Exigencia Física
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#24211D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-oro-indigena"
              >
                <option value="FACIL">Fácil (Paseos panorámicos familiares)</option>
                <option value="MODERADO">Moderado (Senderos de 2 a 4 horas)</option>
                <option value="EXIGENTE">Exigente (Desniveles pronunciados)</option>
                <option value="EXTREMO">Extremo (Alta resistencia volcánica)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-1.5">
                <CurrencyDollar size={14} className="text-oro-indigena" /> Tarifa / Persona (USD)
              </label>
              <input
                required
                type="number"
                min={5}
                max={2000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-hidden focus:border-oro-indigena"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-1.5">
                <Clock size={14} className="text-oro-indigena" /> Duración (Horas)
              </label>
              <input
                required
                type="number"
                min={1}
                max={48}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-hidden focus:border-oro-indigena"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-1.5">
                <Users size={14} className="text-oro-indigena" /> Cupo Máximo
              </label>
              <input
                required
                type="number"
                min={1}
                max={50}
                value={maxGroupSize}
                onChange={(e) => setMaxGroupSize(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-hidden focus:border-oro-indigena"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-2">
              Descripción de la Ruta & Logística
            </label>
            <textarea
              required
              rows={4}
              placeholder="Detalla los puntos clave, paradas para fotografía, nivel de altitud y qué debe llevar el viajero..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-400 focus:outline-hidden focus:border-oro-indigena"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-3">
              Servicios y Equipamiento Incluidos
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {amenitiesList.map((item) => {
                const isSelected = included.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleIncluded(item)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? "bg-oro-indigena/10 border-oro-indigena text-white"
                        : "bg-white/5 border-white/10 text-stone-400 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-oro-indigena border-oro-indigena text-volcano-black"
                          : "border-white/30"
                      }`}
                    >
                      {isSelected && <CheckCircle size={12} weight="bold" />}
                    </div>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/proveedores"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-mono transition-colors"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 rounded-xl bg-oro-indigena text-volcano-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-oro-indigena/90 transition-colors flex items-center gap-2 shadow-lg"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" /> Guardando en Catálogo...
                </>
              ) : (
                <>
                  <PlusCircle size={16} weight="bold" /> Publicar Experiencia
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
