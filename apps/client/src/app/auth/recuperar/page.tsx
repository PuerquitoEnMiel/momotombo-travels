"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  LockSimple,
  EnvelopeSimple,
  Key,
  ShieldCheck,
  CheckCircle,
  PhoneCall,
  FileText,
  Radio,
  SpinnerGap,
} from "@phosphor-icons/react";
import { API_URL } from "@/lib/api";

function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Protocol Zero-Knowledge: treat any response as success to prevent enumeration
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "No pudimos procesar la solicitud en la terminal.");
      }
    } catch {
      setError("Error de enlace satelital. Intente nuevamente en unos instantes.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="bg-[#faf2ed] border border-dashed border-[#dbc1bb] rounded-xl p-6 sm:p-8 relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#dbc1bb]/40 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e3b2f]"></span>
              <span className="font-mono text-xs text-[#1e3b2f] font-bold tracking-wider uppercase">
                DESPACHO DIPLOMÁTICO CONFIRMADO
              </span>
            </div>
            <span className="font-mono text-xs text-[#88726d]">ESTADO: EN CAMINO</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c6e7d6] text-[#1e3b2f] flex items-center justify-center shrink-0">
              <CheckCircle size={28} weight="duotone" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-serif text-xl font-bold text-[#1e1b18]">
                Instrucción Criptográfica Despachada
              </h3>
              <p className="text-sm text-[#55423e] leading-relaxed">
                Si el correo <strong className="text-[#1e1b18] font-mono">{email}</strong> está registrado en nuestros expedientes de expedición, se ha emitido un enlace temporal de re-acreditación válido por <strong>1 hora</strong>.
              </p>
              <div className="mt-3 inline-block font-mono text-xs text-[#8a3824] font-semibold bg-white/80 px-3 py-1.5 rounded border border-[#dbc1bb]/60">
                VIGENCIA DEL ENLACE: 1 HORA
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/auth/login"
            id="link-back-login-success"
            className="flex-1 h-12 bg-[#8a3824] hover:bg-[#6c2210] text-[#fff8f4] font-mono text-xs uppercase tracking-widest font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Retornar a Terminal de Acceso</span>
            <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className="px-6 h-12 border border-[#dbc1bb] text-[#55423e] hover:bg-[#f4ece7] font-mono text-xs uppercase tracking-widest font-medium rounded-lg transition-colors"
          >
            Reintentar con otro correo
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error && (
        <div
          role="alert"
          className="bg-[#ffdad6] text-[#93000a] p-4 rounded-lg text-sm border border-[#ba1a1a]/30 flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="input-forgot-email"
          className="block font-mono text-xs tracking-wider uppercase text-[#1e1b18] font-bold"
        >
          Correo Electrónico Oficial del Expedicionario <span className="text-[#8a3824]">*</span>
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#88726d]">
            <EnvelopeSimple size={20} />
          </div>
          <input
            id="input-forgot-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="block w-full pl-11 pr-4 py-3.5 bg-white border border-[#dbc1bb] rounded-lg text-[#1e1b18] font-mono text-sm placeholder:text-[#88726d]/60 focus:border-[#8a3824] focus:ring-4 focus:ring-[#8a3824]/10 transition-all outline-none"
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-[#88726d] px-1 font-mono">
          <span>Sintaxis cifrada bajo estándares RFC 5322</span>
          <span>Canal Diplomatic ID</span>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          id="btn-forgot-submit"
          className="w-full h-13 bg-[#8a3824] hover:bg-[#6c2210] disabled:opacity-75 text-[#fff8f4] rounded-lg font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {loading ? (
            <>
              <SpinnerGap size={18} className="animate-spin" />
              <span>Generando Token Criptográfico...</span>
            </>
          ) : (
            <>
              <Key size={18} weight="duotone" />
              <span>Emitir Enlace Criptográfico de Recuperación</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      <div className="text-center pt-2">
        <a
          href="tel:+50522492760"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#55423e] hover:text-[#8a3824] transition-colors underline underline-offset-4 decoration-[#c49a45]"
        >
          <PhoneCall size={14} className="text-[#c49a45]" />
          <span>¿Requiere asistencia satelital inmediata? Contacte al Concierge Privado</span>
        </a>
      </div>
    </form>
  );
}

function ForgotFallback() {
  return (
    <div className="flex justify-center py-12">
      <SpinnerGap size={36} className="animate-spin text-[#8a3824]" />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-[#1e1b18] antialiased selection:bg-[#8a3824] selection:text-white">
      {/* Top Header */}
      <header className="w-full bg-background/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#dbc1bb]/40 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 border border-[#8a3824]/40 flex items-center justify-center bg-[#faf2ed] shadow-xs group-hover:border-[#8a3824] transition-colors">
              <span className="font-serif text-lg text-[#8a3824] font-bold">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-tight text-[#1e1b18] font-bold leading-tight">
                MOMOTOMBO
              </span>
              <span className="font-mono text-[9px] tracking-widest text-[#55423e] uppercase">
                Momotombo Travels
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center">
            <Link
              href="/auth/login"
              id="link-return-login-top"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-[#55423e] hover:text-[#8a3824] transition-colors py-1.5 px-3 rounded-md hover:bg-[#f4ece7]"
            >
              <ArrowLeft size={16} />
              <span>Volver a Terminal de Acceso</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 bg-[#eee7e2] border border-[#dbc1bb]/60 px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e3b2f] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1e3b2f]"></span>
            </span>
            <LockSimple size={14} className="text-[#1e3b2f]" weight="bold" />
            <span className="font-mono text-[10px] tracking-wider text-[#1e1b18] font-semibold">
              TLS 256-bit · PROTOCOLO CIFRADO
            </span>
          </div>
        </div>
      </header>

      {/* Main Clearance Canvas */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {/* Clearance Card */}
          <div className="bg-white/95 border border-[#dbc1bb]/70 rounded-xl p-8 sm:p-12 shadow-[0_16px_36px_-4px_rgba(30,27,24,0.06),0_4px_12px_-2px_rgba(30,27,24,0.03)] backdrop-blur-sm relative overflow-hidden">
            {/* Top Volcanic Ochre & Terracotta Heritage Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8a3824] via-[#c49a45] to-[#1e3b2f]"></div>

            {/* Header Content */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#8a3824]"></span>
                <span className="font-mono text-[10px] tracking-widest text-[#8a3824] uppercase font-bold">
                  PROTOCOLO DE SEGURIDAD VIP · RECUPERACIÓN DE CLAVE
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1e1b18] font-bold mb-3 tracking-tight">
                Restablecimiento de Credencial Diplomática
              </h1>
              <p className="text-sm text-[#55423e] leading-relaxed">
                Ingrese el correo electrónico oficial vinculado a su expediente de expedición. Si la terminal verifica su registro, emitiremos un enlace criptográfico temporal para restablecer su clave de acceso.
              </p>
            </div>

            {/* Zero-Knowledge Confidentiality Notice */}
            <div className="bg-[#1e3b2f]/5 border border-[#1e3b2f]/20 rounded-lg p-4 sm:p-5 mb-8 flex gap-3.5 items-start">
              <div className="p-2 bg-[#1e3b2f]/10 rounded-md text-[#1e3b2f] shrink-0 mt-0.5">
                <ShieldCheck size={22} weight="duotone" />
              </div>
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#1e3b2f] font-bold mb-1">
                  Protocolo Zero-Knowledge Anti-Enumeración
                </h4>
                <p className="text-xs text-[#55423e] leading-relaxed">
                  Por estrictas normativas de confidencialidad, el sistema procesa cada solicitud de forma ciega sin
                  confirmar públicamente si el correo está registrado en esta terminal.
                </p>
              </div>
            </div>

            {/* Form */}
            <Suspense fallback={<ForgotFallback />}>
              <ForgotForm />
            </Suspense>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-[#f4ece7]/70 border border-[#dbc1bb]/50 rounded-lg p-3.5">
              <LockSimple size={22} className="text-[#8a3824]" weight="duotone" />
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#1e1b18] font-bold">Cifrado SHA-256</span>
                <span className="text-[11px] text-[#55423e]">Extremo a Extremo</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#f4ece7]/70 border border-[#dbc1bb]/50 rounded-lg p-3.5">
              <ShieldCheck size={22} className="text-[#1e3b2f]" weight="duotone" />
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#1e1b18] font-bold">Anti-Fuerza Bruta</span>
                <span className="text-[11px] text-[#55423e]">Vigilancia Criptográfica</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#f4ece7]/70 border border-[#dbc1bb]/50 rounded-lg p-3.5">
              <FileText size={22} className="text-[#c49a45]" weight="duotone" />
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#1e1b18] font-bold">Enlace Temporal</span>
                <span className="text-[11px] text-[#55423e]">Válido por 1 hora</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#eee7e2] border-t border-[#dbc1bb]/50 py-6">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="font-mono text-xs text-[#8a3824] font-semibold flex items-center gap-1.5">
              <Radio size={16} />
              SOPORTE AL VIAJERO 24/7: +505 2249-2760
            </span>
          </div>
          <div className="text-xs text-[#55423e]">
            © 2025 Momotombo Travels. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
