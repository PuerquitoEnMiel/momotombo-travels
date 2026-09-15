"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  PaperPlaneRight,
  Sparkle,
  Calendar,
  Mountains,
  TreePalm,
  Sun,
  Compass,
  CaretRight,
  MapPin,
  Timer,
  UsersThree,
  DownloadSimple,
  FloppyDisk,
  ChatCircleText,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/lib/api";

/* ─── types ───────────────────────────────────────────────────────────────── */

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: DestinationSuggestion[];
  action_type?: string;
  timestamp?: Date;
}

interface DestinationSuggestion {
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  price_level?: string;
  category?: string;
}

/* ─── starter prompts ─────────────────────────────────────────────────────── */

const STARTER_PROMPTS = [
  {
    icon: Mountains,
    label: "Aventura Volcánica",
    description: "Ascenso a cráteres activos, sandboarding en Cerro Negro y baños termales",
    prompt: "Quiero hacer una aventura de volcanes por 3 días combinando sandboarding y baños termales",
  },
  {
    icon: TreePalm,
    label: "Playas & Relax",
    description: "Costa Esmeralda, villas privadas sobre acantilados y surf secreto",
    prompt: "Busco playas paradisíacas para relajarme 5 días con alojamiento de lujo",
  },
  {
    icon: Compass,
    label: "Tour Completo",
    description: "Ruta colonial Granada–León con expedición a Ometepe en catamarán",
    prompt: "Planea un tour de 7 días por lo mejor de Nicaragua, colonial y naturaleza",
  },
  {
    icon: Sun,
    label: "Fin de Semana",
    description: "Escape exprés: casona patrimonial, ron Flor de Caña y laguna de Apoyo",
    prompt: "Un fin de semana romántico en una ciudad colonial con laguna volcánica",
  },
] as const;

/* ─── sub-components ──────────────────────────────────────────────────────── */

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3.5" aria-label="Kary está escribiendo">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 bg-[#8a3824] rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function KaryAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = { sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-base", lg: "w-16 h-16 text-2xl" }[size];
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold text-white shrink-0 relative`}
      style={{ background: "linear-gradient(135deg, #8a3824 0%, #c49a45 100%)" }}
      aria-hidden="true"
    >
      K
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#476557] rounded-full border-2 border-white" />
    </div>
  );
}

function SuggestionCard({ dest }: { dest: DestinationSuggestion }) {
  return (
    <Link
      href={`/explorar/${dest.slug ?? ""}`}
      className="group flex items-center gap-3 bg-[#fff8f4] border border-[#dbc1bb] rounded-xl p-3 hover:border-[#8a3824]/40 hover:shadow-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#C49A45]"
    >
      {/* thumbnail */}
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-dim shrink-0 relative">
        {dest.image_url ? (
          <Image src={dest.image_url} alt={dest.name} fill className="object-cover" sizes="56px" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Mountains size={20} className="text-outline" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#1e1b18] text-sm truncate group-hover:text-[#8a3824] transition-colors">
          {dest.name}
        </p>
        {dest.description && (
          <p className="text-on-surface-variant text-xs line-clamp-1 mt-0.5">{dest.description}</p>
        )}
        {dest.price_level && (
          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-[0.08em] bg-[#ffdad2] text-[#6c2210] rounded-full px-2 py-0.5">
            {dest.price_level}
          </span>
        )}
      </div>
      <CaretRight size={14} className="text-outline group-hover:text-[#8a3824] shrink-0 transition-colors" aria-hidden="true" />
    </Link>
  );
}

function formatContent(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

/* ─── main page ───────────────────────────────────────────────────────────── */

export default function PlanificarPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const userMessage = text ?? input;
      if (!userMessage.trim() || isLoading) return;

      if (!started) setStarted(true);
      setInput("");

      const newUserMsg: Message = {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newUserMsg]);
      setIsLoading(true);

      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const response = await fetch(`${API_URL}/gemini-agent/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage, history }),
        });

        if (!response.ok) throw new Error("Error conectando con Kary");

        const data = await response.json() as {
          message: string;
          suggested_destinations?: DestinationSuggestion[];
          action_type?: string;
        };

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            suggestions: data.suggested_destinations,
            action_type: data.action_type,
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Lo siento, hubo un error de conexión. ¿Intentamos de nuevo?",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, isLoading, started, messages]
  );

  /* derived: all suggested destinations across conversation */
  const allSuggestions = messages
    .filter((m) => m.suggestions && m.suggestions.length > 0)
    .flatMap((m) => m.suggestions!);

  const uniqueSuggestions = allSuggestions.filter(
    (dest, idx, arr) => arr.findIndex((d) => d.name === dest.name) === idx
  );

  return (
    <main
      className="h-screen flex overflow-hidden bg-[#fff8f4]"
      id="planificar-page"
      style={{ paddingTop: "72px" }} // account for fixed global Navbar
    >
      {/* ── LEFT PANEL — Chat (60%) ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#E8E2D5]">

        {/* Kary header */}
        <header className="shrink-0 bg-white border-b border-[#E8E2D5] px-6 py-4 flex items-center gap-4">
          <KaryAvatar size="md" />
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-lg font-semibold text-[#1e1b18] flex items-center gap-2">
              Kary
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#ffdad2] text-[#6c2210] px-2 py-0.5 rounded-full">
                Guía IA
              </span>
            </h1>
            <p className="text-xs text-outline mt-0.5">
              Planificadora IA · Especialista en Nicaragua
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-dim border border-[#dbc1bb] rounded-full px-3 py-1.5">
            <Sparkle size={12} className="text-[#C49A45]" weight="fill" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-on-surface-variant tracking-wide">
              Powered by Gemini
            </span>
          </div>
        </header>

        {/* Messages / Welcome area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!started ? (
              /* ── Welcome state ── */
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center h-full px-6 py-12"
              >
                {/* ambient volcano bg */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.025]"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse at 50% 80%, #8a3824 0%, transparent 65%), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 60 L30 0 L60 60' fill='none' stroke='%238a3824' stroke-width='0.5'/%3E%3C/svg%3E\")",
                  }}
                  aria-hidden="true"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="text-center mb-10 relative"
                >
                  {/* large avatar */}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-2xl shadow-[#8a3824]/20"
                    style={{ background: "linear-gradient(135deg, #8a3824 0%, #c49a45 100%)" }}
                  >
                    K
                  </div>
                  <h2 className="font-serif text-4xl font-semibold text-[#1e1b18] mb-3">
                    ¿A dónde te lleva la{" "}
                    <em className="text-[#8a3824] not-italic">aventura</em>?
                  </h2>
                  <p className="text-on-surface-variant text-lg max-w-md mx-auto leading-relaxed">
                    Soy Kary, tu guía IA. Cuéntame qué tipo de viaje sueñas y crearé
                    un itinerario personalizado para vos.
                  </p>
                </motion.div>

                {/* 2×2 starter chip grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {STARTER_PROMPTS.map((s, i) => (
                    <motion.button
                      key={s.label}
                      id={`prompt-starter-${i}`}
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                      onClick={() => sendMessage(s.prompt)}
                      className="group flex items-start gap-3 bg-white border border-[#E8E2D5] rounded-2xl p-4 text-left hover:border-[#8a3824]/40 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#C49A45]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-dim flex items-center justify-center text-[#8a3824] group-hover:bg-[#8a3824] group-hover:text-white transition-all duration-200 shrink-0">
                        <s.icon size={18} aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1e1b18] text-sm group-hover:text-[#8a3824] transition-colors">
                          {s.label}
                        </p>
                        <p className="text-outline text-xs mt-0.5 leading-snug line-clamp-2">
                          {s.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* ── Chat messages ── */
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto px-6 py-6 space-y-6"
              >
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {/* Kary avatar on assistant messages */}
                    {msg.role === "assistant" && <KaryAvatar size="sm" />}

                    <div
                      className={`flex flex-col gap-3 ${
                        msg.role === "user" ? "items-end" : "items-start"
                      } max-w-[82%]`}
                    >
                      {/* bubble */}
                      <div
                        className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#211e1b] text-white rounded-br-sm"
                            : "bg-white text-[#1e1b18] border border-[#E8E2D5] shadow-sm rounded-bl-sm"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html:
                            msg.role === "assistant"
                              ? formatContent(msg.content)
                              : msg.content,
                        }}
                      />
                      {/* timestamp */}
                      {msg.timestamp && (
                        <time
                          dateTime={msg.timestamp.toISOString()}
                          className="text-[10px] text-outline px-1"
                        >
                          {msg.timestamp.toLocaleTimeString("es-NI", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      )}
                      {/* destination suggestion cards */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="w-full space-y-2">
                          {msg.suggestions.map((dest, i) => (
                            <SuggestionCard key={i} dest={dest} />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* typing indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <KaryAvatar size="sm" />
                    <div className="bg-white border border-[#E8E2D5] rounded-2xl rounded-bl-sm shadow-sm">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Sticky input bar ── */}
        <div className="shrink-0 bg-white border-t border-[#E8E2D5] px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-surface-container border border-[#dbc1bb] rounded-2xl focus-within:border-[#8a3824] focus-within:shadow-[0_0_0_3px_rgba(138,56,36,0.10)] transition-all duration-200 px-5 py-3">
              <ChatCircleText size={18} className="text-outline shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                id="input-plan-chat"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void sendMessage()}
                placeholder="Describe tu viaje ideal (ej. fechas, acompañantes, ritmo preferido)…"
                className="flex-1 bg-transparent outline-none text-[#1e1b18] placeholder-outline text-sm"
                disabled={isLoading}
                aria-label="Escribe tu mensaje para Kary"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                id="btn-plan-send"
                disabled={isLoading || !input.trim()}
                aria-label="Enviar mensaje"
                className="w-10 h-10 bg-[#8a3824] hover:bg-[#6c2210] disabled:bg-[#dbc1bb] disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-[#C49A45]"
              >
                <PaperPlaneRight size={16} aria-hidden="true" />
              </button>
            </div>
            {/* quick tags */}
            {!started && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {["Presupuesto flexible", "4–6 días", "Pareja", "Guía certificado"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setInput((prev) => `${prev} ${tag}`)}
                      className="text-[11px] font-semibold text-on-surface-variant bg-white border border-[#dbc1bb] hover:border-[#8a3824] hover:text-[#8a3824] rounded-full px-3 py-1 transition-all duration-150"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            )}
            <p className="text-center text-[11px] text-outline mt-3">
              Kary usa IA generativa · Los precios y datos son aproximados
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Itinerary Sidebar (40%) ───────────────────────── */}
      <AnimatePresence>
        {started && (
          <motion.aside
            key="sidebar"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="hidden lg:flex w-[380px] shrink-0 flex-col bg-surface-container border-l border-[#E8E2D5]"
          >
            {/* Panel header */}
            <div className="px-6 py-5 border-b border-[#E8E2D5] flex items-start justify-between">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#1e1b18] flex items-center gap-2">
                  <Calendar size={18} className="text-[#8a3824]" weight="fill" aria-hidden="true" />
                  Tu Itinerario
                </h2>
                <p className="text-xs text-outline mt-1" aria-live="polite">
                  {uniqueSuggestions.length > 0
                    ? `${uniqueSuggestions.length} destino${uniqueSuggestions.length !== 1 ? "s" : ""} curado${uniqueSuggestions.length !== 1 ? "s" : ""}`
                    : "Conversando con Kary…"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Compartir itinerario"
                className="w-8 h-8 rounded-lg bg-white border border-[#dbc1bb] text-on-surface-variant hover:border-[#8a3824] hover:text-[#8a3824] flex items-center justify-center transition-all"
              >
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>

            {/* Stats strip */}
            {uniqueSuggestions.length > 0 && (
              <div className="grid grid-cols-3 divide-x divide-[#dbc1bb] border-b border-[#E8E2D5] bg-white/60">
                {[
                  { icon: <Timer size={13} className="text-[#8a3824]" aria-hidden="true" />, label: "Duración", value: "5D / 4N" },
                  { icon: <Mountains size={13} className="text-[#8a3824]" aria-hidden="true" />, label: "Dificultad", value: "Moderada" },
                  { icon: <UsersThree size={13} className="text-[#8a3824]" aria-hidden="true" />, label: "Personas", value: "2 pax" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 gap-0.5">
                    {icon}
                    <span className="text-[9px] font-bold uppercase tracking-widest text-outline">{label}</span>
                    <span className="text-xs font-bold text-[#1e1b18]">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Destination list */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {uniqueSuggestions.length === 0 ? (
                /* empty state */
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#dbc1bb] flex items-center justify-center">
                    <MapPin size={24} className="text-[#dbc1bb]" weight="fill" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-outline">
                    Tu itinerario aparecerá aquí
                  </p>
                  <p className="text-xs text-outline/70 max-w-[180px]">
                    Cuéntale a Kary qué tipo de viaje deseas
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uniqueSuggestions.map((dest, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      {/* step number + connector */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 rounded-full bg-[#8a3824] text-white flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        {i < uniqueSuggestions.length - 1 && (
                          <div className="w-px flex-1 bg-[#dbc1bb] mt-1 mb-1 min-h-5" aria-hidden="true" />
                        )}
                      </div>

                      {/* card */}
                      <div className="flex-1 bg-white border border-[#E8E2D5] rounded-xl p-3 mb-3">
                        {dest.image_url ? (
                          <div className="relative w-full h-20 rounded-lg overflow-hidden mb-2">
                            <Image
                              src={dest.image_url}
                              alt={dest.name}
                              fill
                              className="object-cover"
                              sizes="320px"
                              unoptimized
                            />
                          </div>
                        ) : null}
                        <p className="font-semibold text-[#1e1b18] text-sm">{dest.name}</p>
                        {dest.description && (
                          <p className="text-on-surface-variant text-xs mt-0.5 line-clamp-2 leading-snug">
                            {dest.description}
                          </p>
                        )}
                        {dest.price_level && (
                          <span className="inline-block mt-2 text-[10px] font-bold tracking-wide uppercase bg-surface-container border border-[#dbc1bb] text-on-surface-variant rounded-full px-2 py-0.5">
                            {dest.price_level}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* completion indicator */}
                  <div className="flex items-center gap-2 px-2 py-1">
                    <CheckCircle size={16} className="text-[#476557]" weight="fill" aria-hidden="true" />
                    <span className="text-xs text-[#476557] font-semibold">
                      Itinerario en curso · {uniqueSuggestions.length} destinos
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky CTA buttons */}
            <div className="shrink-0 p-4 border-t border-[#E8E2D5] space-y-2.5">
              <button
                type="button"
                id="btn-save-itinerary"
                disabled={uniqueSuggestions.length === 0}
                className="w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-px active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-[#C49A45]"
                style={{
                  background:
                    "linear-gradient(135deg, #8a3824 0%, #6c2210 50%, #c49a45 100%)",
                }}
              >
                <FloppyDisk size={16} aria-hidden="true" />
                Guardar & Continuar Expedición
              </button>
              <button
                type="button"
                id="btn-download-pdf"
                disabled={uniqueSuggestions.length === 0}
                className="w-full flex items-center justify-center gap-2 text-on-surface-variant border border-[#dbc1bb] hover:border-[#8a3824] hover:text-[#8a3824] font-semibold text-sm py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#C49A45]"
              >
                <DownloadSimple size={15} aria-hidden="true" />
                Descargar Dossier PDF
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}
