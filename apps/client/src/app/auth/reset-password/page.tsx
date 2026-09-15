"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LockKey,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeSlash,
  ArrowLeft,
} from "@phosphor-icons/react";
import { authService } from "@/services/auth.service";
import { Spinner, Button } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token de recuperación no válido o faltante en la URL.");
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
      toast.success("Contraseña actualizada con éxito");
    } catch (err: any) {
      setError(err?.message || "No se pudo restablecer la contraseña. El enlace puede haber caducado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#EDE8E3] pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Volver a Inicio de Sesión
          </Link>
        </div>

        <div className="bg-[#1C1A17] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-oro-indigena/10 text-oro-indigena flex items-center justify-center mx-auto mb-4 border border-oro-indigena/20">
              <LockKey size={24} weight="duotone" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-oro-indigena block mb-1">
              Seguridad de la Cuenta
            </span>
            <h1 className="font-serif text-2xl font-light text-white">
              Restablecer Contraseña
            </h1>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Ingresa una clave segura para proteger tus expediciones e itinerarios en Momotombo Travels.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-selva-esmeralda/15 text-selva-esmeralda rounded-full flex items-center justify-center mx-auto border border-selva-esmeralda/30">
                <CheckCircle size={32} weight="duotone" />
              </div>
              <div>
                <h3 className="font-medium text-white text-base">Clave Actualizada</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Tu nueva contraseña ha sido registrada correctamente.
                </p>
              </div>
              <Link
                href="/auth/login"
                id="btn-login-after-reset"
                className="w-full py-3 rounded-xl bg-oro-indigena text-volcano-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-oro-indigena/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Iniciar Sesión <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-sunset-orange/15 border border-sunset-orange/30 text-sunset-orange text-xs font-mono">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-1.5">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-400 focus:outline-hidden focus:border-oro-indigena pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 mb-1.5">
                  Confirmar Contraseña
                </label>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Repite la nueva clave"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-400 focus:outline-hidden focus:border-oro-indigena"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  id="btn-submit-reset-password"
                  className="w-full py-3 rounded-xl bg-oro-indigena text-volcano-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-oro-indigena/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" /> Guardando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} weight="bold" /> Guardar Nueva Contraseña
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
