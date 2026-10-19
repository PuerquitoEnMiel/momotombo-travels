"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation, Trans } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  EnvelopeSimple,
  Key,
  Eye,
  EyeSlash,
  LockKey,
  LockSimple,
  CheckCircle,
  ShieldCheck,
  User,
  AirplaneTilt,
  Mountains,
  PhoneCall,
  CaretRight,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ApiException } from "@/types/api";
import { API_URL } from "@/lib/api";

export default function RegistroPage() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateField = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("Debe aceptar los términos y condiciones para continuar.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await register(formData);
      setSuccess(true);
      toast.success(t("login.registeredSuccess", "Expediente emitido con éxito."));
      setTimeout(() => router.push("/auth/login?registered=true"), 1500);
    } catch (err) {
      let message = t("register.errors.generic", "No se pudo procesar la solicitud de admisión.");
      if (err instanceof ApiException) {
        if (err.statusCode === 409) {
          message = t("register.errors.emailTaken", "Este correo electrónico ya cuenta con un expediente activo.");
        } else if (err.message.toLowerCase().includes("password")) {
          message = t("register.errors.weakPassword", "La contraseña debe tener al menos 6 caracteres.");
        } else {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#fff8f4] text-[#1e1b18] antialiased selection:bg-primary selection:text-white">
      {/* ======================================================== */}
      {/* LEFT COLUMN: Sanctuary & Diplomatic Spread (50% desktop) */}
      {/* ======================================================== */}
      <section className="relative w-full lg:w-1/2 min-h-[520px] lg:min-h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden bg-[#1e1b18] text-white">
        {/* Full-bleed Scenic Photography */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmvEtolAPWJFPu18I_m24pqBJT0vijhYageyOwwelWq4yn2HT-01DHwgHF8OVBW2z_mdrrlIP8j4H9dpqSuWtU9lfFAekk9UPs6_bV16XPbf3nfZEpPOX55sg6r-Q6KZCvxgNF90dFuQdm9BgYqNgyQ1bCN3ogGvEl7A1OhebD96yH4xAsWeJZH-cgIrNS2RlakLhOXrSX4YXRZk6bkXraW9Y4Z_YJSutXFgSvA-lKewIOD3m1X2ggDhJFhU_11OZoP3GKSXvr62Zd"
          alt="Amanecer volcánico en la isla de Ometepe"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
        />

        {/* Multi-stop Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b18] via-[#1e1b18]/65 to-[#8a3824]/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b18]/80 via-transparent to-[#1e1b18]/40" />

        {/* Top Archival Badge */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#1e1b18]/80 backdrop-blur-md border border-[#c49a45]/40 shadow-sm">
            <ShieldCheck size={18} weight="fill" className="text-tertiary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-tertiary font-bold">
              MEMBRESÍA EXPEDICIONARIA · MOMOTOMBO TRAVELS
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-[10px] font-mono">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
            <span className="text-stone-200 uppercase tracking-wider">Protocolo Nivel Diplomático</span>
          </div>
        </div>

        {/* Center & Lower Editorial Narrative & Glass Card */}
        <div className="relative z-10 my-auto py-12 flex flex-col justify-end space-y-8 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#c49a45]/60" />
            <span className="text-xs font-mono tracking-widest uppercase text-tertiary font-medium">
              Archivos Cordillera de los Maribios
            </span>
          </div>

          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-white leading-tight">
            “Inscriba su nombre en las bitácoras de los Maribios. Una membresía diseñada para el viajero de alta exigencia.”
          </blockquote>

          {/* Product Features Glass Card */}
          <div className="rounded-2xl p-6 bg-[#1e1b18]/85 backdrop-blur-lg border border-white/15 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono text-tertiary tracking-wider uppercase font-bold">
                Qué incluye Momotombo Travels
              </span>
            </div>

            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3.5">
                <AirplaneTilt size={20} className="text-secondary-container shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Planifica tu itinerario con Kary IA</p>
                  <p className="text-stone-300 mt-0.5 leading-relaxed">Recibe propuestas de ruta adaptadas a tus fechas, intereses y presupuesto.</p>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <Mountains size={20} className="text-tertiary shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Explora destinos de Nicaragua</p>
                  <p className="text-stone-300 mt-0.5 leading-relaxed">Volcanes, playas del Pacífico y ciudades coloniales reunidos en un solo catálogo.</p>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <ShieldCheck size={20} className="text-secondary-container shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Reserva y paga en línea</p>
                  <p className="text-stone-300 mt-0.5 leading-relaxed">Gestiona tus reservas, pagos y comprobantes desde tu cuenta.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-[10px] font-mono text-stone-200">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
              Planificación con IA
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <Mountains size={14} className="text-tertiary" />
              Rutas por todo Nicaragua
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <LockSimple size={14} className="text-stone-300" />
              Contraseña Cifrada
            </span>
          </div>
        </div>

        {/* Bottom Caption */}
        <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10 text-stone-400 text-[10px] font-mono">
          <span>Momotombo Travels · Archivos Cartográficos de Nicaragua</span>
          <span>Volcán Concepción &amp; Maderas · 11°32′16″N</span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: Diplomatic Registration Portal (50% desktop) */}
      {/* ======================================================== */}
      <main className="w-full lg:w-1/2 min-h-screen bg-[#fff8f4] px-6 sm:px-12 lg:px-16 py-10 flex flex-col justify-between overflow-y-auto">
        {/* Top Navigation Cluster */}
        <div className="w-full flex items-center justify-between pb-8 border-b border-[#e8e2d5]">
          {/* Return Link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-mono uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={16} className="text-primary transition-transform group-hover:-translate-x-1" />
            <span>Volver al Inicio</span>
          </Link>

          {/* Monogram Crest */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md border border-primary/30 flex items-center justify-center bg-white shadow-xs">
              <span className="font-serif text-lg font-bold text-primary italic leading-none">M</span>
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-serif uppercase tracking-widest text-[#1e1b18] font-bold leading-none">
                MOMOTOMBO
              </span>
              <span className="block text-[9px] uppercase font-mono tracking-wider text-text-muted leading-tight mt-0.5">
                TRAVELS
              </span>
            </div>
          </Link>

          {/* Encrypted Session Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e8e2d5] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <LockKey size={14} weight="fill" className="text-secondary" />
            <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-wider">
              TLS 256-bit
            </span>
          </div>
        </div>

        {/* Portal Form Content */}
        <div className="w-full max-w-lg mx-auto py-8 lg:py-12 flex-1 flex flex-col justify-center">
          {/* Header Area */}
          <div className="mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary-container/60 border border-secondary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-secondary font-bold">
                SOLICITUD DE ADMISIÓN · NUEVO EXPEDIENTE
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1e1b18] font-medium tracking-tight">
              Registro de Expedicionario Titular
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Cree su expediente personal para acceder a itinerarios restringidos, reservar vuelos heli-charter y gestionar credenciales de campo con validez diplomática.
            </p>
          </div>

          {/* Google SSO Luxury Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            id="btn-register-google"
            className="w-full h-12 px-4 rounded-xl bg-white border border-[#e8e2d5] hover:border-outline hover:bg-surface-container-low transition-all duration-200 flex items-center justify-center gap-3 text-[#1e1b18] text-xs font-mono font-semibold uppercase tracking-wider shadow-xs mb-6 cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Registrarse con Google Workspace</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-[#e8e2d5]" />
            <span className="absolute bg-[#fff8f4] px-4 text-[10px] font-mono uppercase tracking-widest text-text-muted">
              o complete su expediente diplomático
            </span>
          </div>

          {success ? (
            <div className="text-center py-10 bg-white border border-[#e8e2d5] rounded-2xl p-8 shadow-xs">
              <div className="w-16 h-16 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} weight="fill" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1e1b18] mb-2">
                Expediente Diplomático Creado
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">
                Redirigiendo a la terminal de acceso seguro...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <div role="alert" className="bg-danger-container text-on-danger-container p-3.5 rounded-xl text-xs font-mono border border-danger/30 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-danger shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Input A: Full Name */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1e1b18] mb-2 font-bold" htmlFor="input-register-name">
                  Nombre Completo del Expedicionario <span className="text-primary">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text-muted pointer-events-none">
                    <User size={18} />
                  </span>
                  <input
                    id="input-register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={updateField("name")}
                    placeholder="Nombre y apellidos"
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-[#e8e2d5] text-[#1e1b18] text-xs font-mono placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-xs"
                  />
                </div>
              </div>

              {/* Input B: Official Email */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1e1b18] mb-2 font-bold" htmlFor="input-register-email">
                  Correo Electrónico Oficial <span className="text-primary">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text-muted pointer-events-none">
                    <EnvelopeSimple size={18} />
                  </span>
                  <input
                    id="input-register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={updateField("email")}
                    placeholder="tu@email.com"
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-[#e8e2d5] text-[#1e1b18] text-xs font-mono placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-xs"
                  />
                </div>
                <p className="text-[10px] font-mono text-text-muted mt-1 pl-1">
                  Se vinculará a sus cartas de vuelo y comprobantes de expedición.
                </p>
              </div>

              {/* Input C: Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1e1b18] font-bold" htmlFor="input-register-password">
                    Contraseña de Enclave <span className="text-primary">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-secondary font-semibold">Cifrado de grado bancario</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text-muted pointer-events-none">
                    <Key size={18} />
                  </span>
                  <input
                    id="input-register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={updateField("password")}
                    placeholder="••••••••••••"
                    className="w-full h-12 pl-11 pr-11 rounded-xl bg-white border border-[#e8e2d5] text-[#1e1b18] text-xs font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-xs"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-text-muted hover:text-[#1e1b18] transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[10px] font-mono text-text-muted mt-1 pl-1">
                  Mínimo 6 caracteres con clave alfanumérica segura.
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-primary bg-white border-[#e8e2d5] focus:ring-primary cursor-pointer mt-0.5"
                  />
                  <span className="text-xs text-on-surface-variant group-hover:text-[#1e1b18] transition-colors leading-relaxed">
                    Acepto los{" "}
                    <Link href="/terminos" className="text-primary font-medium underline underline-offset-2 hover:text-primary-hover">
                      Términos y Condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacidad" className="text-primary font-medium underline underline-offset-2 hover:text-primary-hover">
                      Política de Privacidad
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Primary Action Button */}
              <button
                id="btn-register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white flex items-center justify-between transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer font-mono text-xs uppercase font-bold tracking-wider"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} weight="fill" className="text-secondary-container" />
                  <span>{isLoading ? "Emitiendo Expediente..." : "Emitir Expediente & Solicitar Admisión"}</span>
                </div>
                <ArrowRight size={18} className="text-secondary-container" />
              </button>
            </form>
          )}

          {/* Footnote & Login Switch */}
          {!success && (
            <div className="mt-8 text-center pt-4 border-t border-[#e8e2d5]">
              <p className="text-xs sm:text-sm text-on-surface-variant">
                ¿Ya posee una credencial diplomática activa?{" "}
                <Link
                  href="/auth/login"
                  id="link-to-login"
                  className="font-bold text-primary hover:text-primary-hover inline-flex items-center gap-1 group ml-1 hover:underline"
                >
                  <span>Inicie Sesión en su Bitácora</span>
                  <CaretRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Bottom Security Trust & Hotline Bar */}
        <footer className="w-full pt-6 border-t border-[#e8e2d5] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-text-muted text-[10px] font-mono uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                <CheckCircle size={14} weight="fill" />
                Cifrado SHA-256 de Extremo a Extremo
              </span>
              <span className="hidden sm:inline text-text-muted">•</span>
              <span className="inline-flex items-center gap-1 text-on-surface-variant font-semibold">
                Protección Escrow Garantizada
              </span>
            </div>

            <div className="flex items-center gap-2 text-on-surface-variant">
              <PhoneCall size={14} className="text-primary" />
              <span>24/7 Concierge Hotline:</span>
              <span className="font-bold text-[#1e1b18]">+505 2249-2760</span>
              <span className="text-text-muted">· Soporte al viajero</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-text-muted text-[11px] font-mono pt-2">
            <p>© 2026 Momotombo Travels. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/institucional/garantias" className="hover:text-primary transition-colors">
                Diplomatic Escrow Protocol
              </Link>
              <Link href="/institucional/terminos" className="hover:text-primary transition-colors">
                Security Clearance
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
