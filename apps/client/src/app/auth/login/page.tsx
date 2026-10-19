"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  EnvelopeSimple,
  Key,
  Eye,
  EyeSlash,
  LockKey,
  LockSimple,
  CheckCircle,
  ShieldCheck,
  Compass,
  Pulse,
  PhoneCall,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ApiException } from "@/types/api";
import { API_URL } from "@/lib/api";

function LoginForm() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success(t("login.registeredSuccess", "Registro completado con éxito. Ingrese con sus nuevas credenciales."));
    }
  }, [searchParams, toast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(formData);
      router.push("/itinerarios");
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.statusCode === 401
            ? t("login.errors.invalidCredentials", "Credenciales diplomáticas inválidas. Verifique su correo o contraseña.")
            : err.message
          : t("login.errors.network", "No se pudo conectar con el servidor de autenticación.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto py-8">
      {/* Form Header Area */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted font-bold">
            CREDENCIALES DE EXPEDICIÓN
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/60 text-secondary text-[9px] font-mono uppercase tracking-wider font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            ACCESO RESTRINGIDO
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#1e1b18] font-medium tracking-tight mb-3">
          Acceso a su Bitácora de Viaje
        </h1>

        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Ingrese sus credenciales de expedicionario o pasaporte digital para sincronizar itinerarios privados, brigadas de campo y cartas de vuelo.
        </p>
      </div>

      {/* Google SSO Luxury Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        id="btn-login-google"
        className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-white border border-[#e8e2d5] hover:border-outline hover:bg-surface-container-low transition-all duration-200 shadow-xs mb-6 cursor-pointer"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1e1b18]">
          Continuar con Google Workspace
        </span>
      </button>

      {/* Editorial Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="w-full border-t border-[#e8e2d5]" />
        <span className="absolute bg-[#fff8f4] px-4 text-[10px] font-mono uppercase tracking-widest text-text-muted">
          o mediante credencial autorizada
        </span>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div role="alert" className="mb-5 bg-danger-container text-on-danger-container p-3.5 rounded-xl text-xs font-mono border border-danger/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-danger shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Diplomatic Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Input A: Email */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1e1b18] mb-2 font-bold" htmlFor="input-login-email">
            Correo Electrónico Oficial
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-text-muted pointer-events-none">
              <EnvelopeSimple size={18} />
            </span>
            <input
              id="input-login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu@email.com"
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-[#e8e2d5] text-[#1e1b18] text-xs font-mono placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Input B: Password */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1e1b18] mb-2 font-bold" htmlFor="input-login-password">
            Contraseña de Enclave
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-text-muted pointer-events-none">
              <Key size={18} />
            </span>
            <input
              id="input-login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
        </div>

        {/* Options Row */}
        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              id="input-login-remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-primary bg-white border-[#e8e2d5] focus:ring-primary cursor-pointer"
            />
            <span className="text-xs text-on-surface-variant font-medium">Recordar credencial en esta estación</span>
          </label>
          <Link
            href="/auth/recuperar"
            id="link-login-forgot"
            className="text-xs font-mono uppercase tracking-wider text-primary hover:text-primary-hover font-semibold hover:underline"
          >
            ¿Olvidó su clave?
          </Link>
        </div>

        {/* Primary Action Button */}
        <button
          id="btn-login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full h-12 mt-2 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white flex items-center justify-between transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer font-mono text-xs uppercase font-bold tracking-wider"
        >
          <div className="flex items-center gap-2.5">
            <LockSimple size={18} weight="fill" className="text-secondary-container" />
            <span>{isLoading ? "Validando Manifiesto..." : "Ingresar a la Bitácora de Expedición"}</span>
          </div>
          <ArrowRight size={18} className="text-secondary-container" />
        </button>
      </form>

      {/* Footnote & Admission Link */}
      <div className="mt-8 pt-6 border-t border-[#e8e2d5] text-center">
        <p className="text-xs sm:text-sm text-on-surface-variant">
          ¿Aún no posee credencial expedicionaria?{" "}
          <Link
            href="/auth/registro"
            id="link-to-register"
            className="font-bold text-primary hover:text-primary-hover inline-flex items-center gap-1 group hover:underline"
          >
            <span>Solicite su Admisión</span>
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#fff8f4] text-[#1e1b18] antialiased selection:bg-primary selection:text-white">
      {/* ======================================================== */}
      {/* LEFT COLUMN: Expedition Heritage & Editorial Spread     */}
      {/* ======================================================== */}
      <div className="relative w-full lg:w-1/2 min-h-[500px] lg:min-h-screen overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-16 text-white bg-[#1e1b18]">
        {/* Full-bleed Background Image with Multi-stop Vignette */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdyavk5UWnJ1lR04jBSXZlxQ0kmF3nGUUHpxktcQ7qwmn7BpRzHj20Pp7f9kRHbef90da9zX_SvaIRLnuhzb6dy0bTG3enz9pgvMlJN41GRZxCRlQTaNh0f1ODSmuP_wuOuIczZLunzsts0q3ep_S8YZt8pgIJEMcnCTfOPCgeQ527RdR15noxXCPi1WLRwnP9EZXbo73HyvM_Zz8pGxby9p5VXfFmnMI7g4_sZU4gQDojqWxXNws9H-rUaUz4X3kH2q4v6NVS_dri"
          alt="Momotombo Expeditions scenic overlook at Volcán Mombacho"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
        />
        {/* Multi-stop Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b18]/95 via-[#1e1b18]/45 to-[#8a3824]/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b18]/70 via-transparent to-[#1e1b18]/50" />

        {/* Top Header / Diplomatic Enclave Seal Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#1e1b18]/60 backdrop-blur-md border border-[#c49a45]/40 shadow-sm">
            <ShieldCheck size={18} weight="fill" className="text-tertiary" />
            <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold">
              ENCLAVE DE SEGURIDAD · MOMOTOMBO TRAVELS
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
            <span>SISTEMA MOMOTOMBO V4.2</span>
          </div>
        </div>

        {/* Center & Lower Editorial Narrative Content */}
        <div className="relative z-10 mt-auto pt-16">
          <div className="flex items-center gap-2 mb-4 text-[#eec067]">
            <Compass size={18} />
            <span className="text-xs font-mono tracking-wider uppercase">
              Reserva Natural Volcán Mombacho · 1,344 msnm
            </span>
          </div>

          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-white leading-tight max-w-xl mb-6">
            “Donde el fuego volcánico y la elegancia colonial custodian el alma expedicionaria.”
          </blockquote>

          {/* Brand Statement */}
          <div className="p-5 rounded-xl bg-[#1e1b18]/80 backdrop-blur-md border border-white/10 max-w-xl mb-8">
            <div className="flex items-start gap-3">
              <Compass size={28} weight="fill" className="text-tertiary shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  Momotombo Travels diseña y reserva experiencias por Nicaragua: volcanes,
                  playas del Pacífico y ciudades coloniales, con guías locales y planificación
                  asistida por inteligencia artificial.
                </p>
              </div>
            </div>
          </div>

          {/* Product Feature Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-white/15 text-[11px] font-mono text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
              <Compass size={14} className="text-secondary-container" />
              <span>Rutas por todo Nicaragua</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
              <Pulse size={14} className="text-tertiary" />
              <span>Asistente de Viaje con IA</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
              <CheckCircle size={14} weight="fill" className="text-secondary-container" />
              <span>Reservas en Línea</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: Diplomatic Access Portal & Login Form     */}
      {/* ======================================================== */}
      <div className="relative w-full lg:w-1/2 min-h-screen bg-[#fff8f4] flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 overflow-y-auto">
        {/* Top Utility Nav Cluster */}
        <div className="w-full flex items-center justify-between pb-8 border-b border-[#e8e2d5]">
          {/* Return Link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-mono uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={16} className="text-primary transition-transform group-hover:-translate-x-1" />
            <span>Volver al Inicio</span>
          </Link>

          {/* Momotombo Monogram Crest */}
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
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
            </span>
            <LockKey size={14} weight="fill" className="text-secondary" />
            <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-wider">
              TLS 256-bit
            </span>
          </div>
        </div>

        {/* Form Container (Suspense Wrapped) */}
        <Suspense fallback={<div className="animate-pulse h-96 w-full max-w-md mx-auto my-auto bg-white border border-[#e8e2d5] rounded-2xl" />}>
          <LoginForm />
        </Suspense>

        {/* Bottom Security Trust & Hotline Bar */}
        <div className="w-full pt-6 border-t border-[#e8e2d5] text-text-muted space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                <CheckCircle size={14} weight="fill" />
                Cifrado SHA-256 de Extremo a Extremo
              </span>
              <span className="hidden sm:inline text-text-muted">•</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-on-surface-variant font-semibold">
                Acceso Georreferenciado Auditado
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-on-surface-variant">
              <PhoneCall size={14} className="text-primary" />
              <span className="font-bold text-[#1e1b18]">+505 2249-2760</span>
              <span className="text-text-muted">|</span>
              <span>Soporte al viajero</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-text-muted font-mono">
            <span>© 2026 Momotombo Travels</span>
            <span className="text-[10px] uppercase tracking-wider">Todos los derechos reservados</span>
          </div>
        </div>
      </div>
    </div>
  );
}
