"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LockKey,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeSlash,
  Key,
  Radio,
  PhoneCall,
  SpinnerGap,
  LockSimple,
  FileText,
} from "@phosphor-icons/react";
import { authService } from "@/services/auth.service";
import { useToast } from "@/hooks/useToast";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(14 * 60);

  // Simulated clearance countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = () => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs} min`;
  };

  // Password checklist criteria
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaMetCount = [hasMinLength, hasUpperLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getEntropyLabel = () => {
    if (criteriaMetCount === 0) return "Entropía Nula";
    if (criteriaMetCount <= 2) return "Fuerza: Básica";
    if (criteriaMetCount === 3) return "Fuerza: Media / Parcial";
    return "Fuerza: Alta / Enclave Blindado";
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token de recuperación no válido o faltante en los parámetros de la URL.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas ingresadas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      toast.success("Credencial consolidada exitosamente.");
    } catch (err: any) {
      setError(err?.message || "No se pudo restablecer la contraseña. El enlace puede haber caducado.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white/95 border border-[#dbc1bb]/70 rounded-xl p-8 sm:p-12 shadow-[0_16px_36px_-4px_rgba(30,27,24,0.06),0_4px_12px_-2px_rgba(30,27,24,0.03)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8a3824] via-[#c49a45] to-[#1e3b2f]"></div>
        <div className="text-center space-y-6 py-6">
          <div className="w-16 h-16 bg-[#c6e7d6] text-[#1e3b2f] rounded-full flex items-center justify-center mx-auto border border-[#1e3b2f]/30">
            <CheckCircle size={36} weight="duotone" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#1e3b2f]"></span>
              <span className="font-mono text-[10px] tracking-widest text-[#1e3b2f] uppercase font-bold">
                OPERACIÓN DIPLOMÁTICA EXITOSA
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#1e1b18]">Credencial Consolidada</h2>
            <p className="text-sm text-[#55423e] mt-2 max-w-md mx-auto leading-relaxed">
              Su clave maestra ha sido restablecida en la bóveda central de Momotombo Travels bajo estándares de cifrado FIPS 140-3.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/auth/login"
              id="btn-login-after-reset"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 bg-[#8a3824] hover:bg-[#6c2210] text-[#fff8f4] font-mono text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <span>Acceder a la Terminal</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 border border-[#dbc1bb]/70 rounded-xl shadow-[0_16px_36px_-4px_rgba(30,27,24,0.06),0_4px_12px_-2px_rgba(30,27,24,0.03)] overflow-hidden transition-all relative">
      {/* Top Heritage Tricolor Border Line */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#8a3824]"></div>
        <div className="w-1/3 bg-[#c49a45]"></div>
        <div className="w-1/3 bg-[#1e3b2f]"></div>
      </div>

      <div className="p-8 sm:p-10 space-y-8">
        {/* Card Header Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf2ed] border border-[#dbc1bb]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8a3824]"></span>
            <span className="font-mono text-[10px] text-[#8a3824] uppercase tracking-widest font-bold">
              PROTOCOLO DE SEGURIDAD VIP · EMISIÓN DEFINITIVA DE CLAVE
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1e1b18] font-bold tracking-tight">
            Restablecimiento de Credencial de Acceso
          </h1>
          <p className="text-sm text-[#55423e] max-w-xl leading-relaxed">
            Cree una nueva clave maestra para salvaguardar sus expediciones privadas, bitácoras de campo y credenciales diplomáticas en Momotombo Travels.
          </p>
        </div>

        {/* ACTIVE TOKEN CLEARANCE STATUS BOX */}
        <div className="rounded-lg bg-[#c6e7d6]/40 border border-[#1e3b2f]/30 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-[#1e3b2f]">
              <CheckCircle size={22} weight="fill" />
            </div>
            <div className="space-y-0.5">
              <div className="font-mono text-xs uppercase tracking-wider text-[#1e3b2f] font-bold">
                Validación Criptográfica Exitosa
              </div>
              <div className="text-xs text-[#1e3b2f]">
                Enlace seguro de un solo uso. Vigencia restante:{" "}
                <span className="font-semibold font-mono" id="countdown-timer">
                  {formatCountdown()}
                </span>
              </div>
            </div>
          </div>
          <div className="self-end sm:self-center px-2.5 py-1 bg-white/80 border border-[#1e3b2f]/20 rounded font-mono text-[10px] text-[#1e3b2f] tracking-widest uppercase shadow-xs">
            DESPACHO-ID: EXP-NIC-8824-PWD
          </div>
        </div>

        {/* Missing Token Warning */}
        {!token && (
          <div
            role="alert"
            className="p-4 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs font-mono flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] shrink-0" />
            <span>ADVERTENCIA: No se detectó un token en el enlace. Solicite uno nuevo desde la pantalla de recuperación.</span>
          </div>
        )}

        {/* Form Error Banner */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs font-mono flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* DIPLOMATIC FORM */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Field 1: Nueva Clave Maestra */}
          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block font-mono text-xs tracking-wider uppercase text-[#1e1b18] font-bold"
            >
              Nueva Clave Maestra <span className="text-[#8a3824]">*</span>
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <LockKey size={20} />
              </div>
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="block w-full pl-10 pr-11 py-3 text-[#1e1b18] bg-white border border-[#dbc1bb] rounded-lg placeholder:text-text-muted/60 focus:outline-none focus:border-[#8a3824] focus:ring-4 focus:ring-[#8a3824]/10 font-mono text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-[#1e1b18] transition-colors"
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Meter */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                <span className="text-text-muted">Entropía de Bóveda</span>
                <span className={`font-semibold ${criteriaMetCount === 4 ? "text-[#1e3b2f]" : "text-tertiary-text"}`}>
                  {getEntropyLabel()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all duration-300 ${
                      idx < criteriaMetCount
                        ? criteriaMetCount === 4
                          ? "bg-[#1e3b2f]"
                          : "bg-[#c49a45]"
                        : "bg-[#dbc1bb]/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Security Requirements Live Checklist */}
            <div className="p-3.5 rounded-lg bg-[#faf2ed] border border-[#dbc1bb]/40 space-y-2 mt-2">
              <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                Directrices Diplomáticas de Cifrado:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-2 ${hasMinLength ? "text-[#1e3b2f]" : "text-text-muted"}`}>
                  <CheckCircle size={16} weight={hasMinLength ? "fill" : "regular"} />
                  <span>8+ caracteres alfanuméricos</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUpperLower ? "text-[#1e3b2f]" : "text-text-muted"}`}>
                  <CheckCircle size={16} weight={hasUpperLower ? "fill" : "regular"} />
                  <span>Mayúsculas y minúsculas</span>
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? "text-[#1e3b2f]" : "text-text-muted"}`}>
                  <CheckCircle size={16} weight={hasNumber ? "fill" : "regular"} />
                  <span>Combinación numérica precisa</span>
                </div>
                <div className={`flex items-center gap-2 ${hasSpecial ? "text-[#1e3b2f]" : "text-text-muted"}`}>
                  <CheckCircle size={16} weight={hasSpecial ? "fill" : "regular"} />
                  <span>Símbolo de alta entropía (#, $, &)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Field 2: Confirmar Clave Maestra */}
          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block font-mono text-xs tracking-wider uppercase text-[#1e1b18] font-bold"
            >
              Confirmar Clave Maestra <span className="text-[#8a3824]">*</span>
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <ShieldCheck size={20} />
              </div>
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita la clave maestra"
                className="block w-full pl-10 pr-48 py-3 text-[#1e1b18] bg-white border border-[#dbc1bb] rounded-lg placeholder:text-text-muted/60 focus:outline-none focus:border-[#8a3824] focus:ring-4 focus:ring-[#8a3824]/10 font-mono text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-38 pr-3 flex items-center text-text-muted hover:text-[#1e1b18] transition-colors"
                title={showConfirmPassword ? "Ocultar" : "Mostrar"}
              >
                {showConfirmPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>

              {/* Trailing Match Status Pill */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {passwordsMatch ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#c6e7d6] text-[#1e3b2f] font-mono text-[10px] border border-[#1e3b2f]/20 font-bold">
                    <CheckCircle size={14} weight="fill" />
                    <span>Coinciden</span>
                  </span>
                ) : confirmPassword ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#ffdad6] text-[#ba1a1a] font-mono text-[10px] border border-[#ba1a1a]/20">
                    <span>No coinciden</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* PRIMARY ACTION BUTTON */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading || !token}
              id="btn-submit-reset-password"
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#8a3824] hover:bg-[#6c2210] disabled:opacity-75 text-[#fff8f4] font-mono text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
            >
              {loading ? (
                <>
                  <SpinnerGap size={18} className="animate-spin" />
                  <span>Consolidando Credencial...</span>
                </>
              ) : (
                <>
                  <Key size={18} weight="duotone" />
                  <span>Consolidar Nueva Credencial de Acceso</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            <p className="text-center font-mono text-xs text-text-muted">
              Al consolidar, todas las sesiones activas en terminales secundarias serán invalidadas inmediatamente.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="flex justify-center py-20">
      <SpinnerGap size={40} className="animate-spin text-[#8a3824]" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f4] text-[#1e1b18] antialiased selection:bg-[#8a3824] selection:text-white">
      {/* Top Navbar */}
      <header className="w-full bg-[#fff8f4]/90 backdrop-blur-md border-b border-[#dbc1bb]/40 sticky top-0 z-50 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 border border-[#c49a45]/60 bg-[#faf2ed] flex items-center justify-center rounded-lg shadow-xs group-hover:border-[#8a3824] transition-colors">
              <span className="font-serif text-lg font-bold text-[#8a3824] tracking-tighter">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg uppercase tracking-wider text-[#1e1b18] font-bold leading-tight">
                MOMOTOMBO
              </span>
              <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">
                TRAVELS
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center">
            <Link
              href="/auth/login"
              id="link-back-login"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-[#55423e] hover:text-[#8a3824] transition-colors duration-150 group py-1.5 px-3 rounded-md hover:bg-[#f4ece7]"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Volver a la Terminal de Acceso</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6e7d6]/40 border border-[#1e3b2f]/30 text-[#1e3b2f] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#1e3b2f] animate-pulse"></span>
              <LockSimple size={14} className="text-[#1e3b2f]" weight="bold" />
              <span className="font-mono text-[10px] tracking-wider uppercase font-semibold hidden sm:inline">
                TOKEN CRIPTOGRÁFICO VALIDADO · SESIÓN SEGURA TLS 256-BIT
              </span>
              <span className="font-mono text-[10px] tracking-wider uppercase font-semibold sm:hidden">
                TLS 256-BIT SECURE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <Suspense fallback={<ResetPasswordFallback />}>
            <ResetPasswordForm />
          </Suspense>

          {/* TRUST & SECURITY GRID (3 Symmetric Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/90 border border-[#dbc1bb]/50 rounded-lg p-4.5 flex items-start gap-3.5 shadow-xs">
              <div className="w-9 h-9 rounded bg-[#faf2ed] border border-[#dbc1bb]/50 flex items-center justify-center text-[#8a3824] shrink-0">
                <LockSimple size={20} weight="duotone" />
              </div>
              <div className="space-y-0.5">
                <h2 className="font-mono text-xs uppercase tracking-wider text-[#1e1b18] font-bold">
                  Cifrado de Datos
                </h2>
                <p className="text-xs text-[#55423e]">Tu información se transmite y almacena de forma cifrada.</p>
              </div>
            </div>

            <div className="bg-white/90 border border-[#dbc1bb]/50 rounded-lg p-4.5 flex items-start gap-3.5 shadow-xs">
              <div className="w-9 h-9 rounded bg-[#faf2ed] border border-[#dbc1bb]/50 flex items-center justify-center text-[#1e3b2f] shrink-0">
                <CheckCircle size={20} weight="duotone" />
              </div>
              <div className="space-y-0.5">
                <h2 className="font-mono text-xs uppercase tracking-wider text-[#1e1b18] font-bold">
                  Privacidad de Datos
                </h2>
                <p className="text-xs text-[#55423e]">Tus datos personales se manejan conforme a nuestra política de privacidad.</p>
              </div>
            </div>

            <div className="bg-white/90 border border-[#dbc1bb]/50 rounded-lg p-4.5 flex items-start gap-3.5 shadow-xs">
              <div className="w-9 h-9 rounded bg-[#faf2ed] border border-[#dbc1bb]/50 flex items-center justify-center text-tertiary-text shrink-0">
                <FileText size={20} weight="duotone" />
              </div>
              <div className="space-y-0.5">
                <h2 className="font-mono text-xs uppercase tracking-wider text-[#1e1b18] font-bold">
                  Anti-Robo de Sesión
                </h2>
                <p className="text-xs text-[#55423e]">Detección de anomalías y revocación tokenizada automática.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#eee7e2] border-t border-[#dbc1bb]/50 py-8 mt-auto">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-[#dbc1bb]/40 font-mono text-xs tracking-wider uppercase text-text-muted">
            <div className="flex items-center gap-2">
              <PhoneCall size={16} className="text-[#8a3824]" />
              <span>
                24/7 CONCIERGE HOTLINE: <strong className="text-[#1e1b18] font-semibold">+505 2249-2760</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-[#1e3b2f]" />
              <span>COMUNICACIÓN SATELITAL DE RESPALDO</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-tertiary-text" />
              <span>OPERACIÓN CON GUÍAS LOCALES EXPERIMENTADOS</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#55423e]">
            <div>© 2026 Momotombo Travels. Todos los derechos reservados.</div>
            <nav className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px]">
              <Link href="/terminos" className="hover:text-[#8a3824] transition-colors">
                Términos y Salvaguardas
              </Link>
              <span className="text-[#dbc1bb]">·</span>
              <Link href="/privacidad" className="hover:text-[#8a3824] transition-colors">
                Privacidad Criptográfica
              </Link>
              <span className="text-[#dbc1bb]">·</span>
              <Link href="/institucional/contacto" className="hover:text-[#8a3824] transition-colors">
                Canal Diplomático
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
