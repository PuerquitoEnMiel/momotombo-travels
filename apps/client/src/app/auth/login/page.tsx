"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AuthCarousel } from "@/components/features/auth/AuthCarousel";
import { Button, Input, Container } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ArrowRight } from "@phosphor-icons/react";
import { ApiException } from "@/types/api";

function LoginForm() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success(t("login.registeredSuccess"));
    }
  }, [searchParams, toast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(formData);
      router.push("/");
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.statusCode === 401
            ? t("login.errors.invalidCredentials")
            : err.message
          : t("login.errors.network");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="font-serif text-4xl font-bold text-volcano-black mb-2 text-balance">{t("login.title")}</h1>
        <p className="text-on-surface-variant">{t("login.subtitle")}</p>
      </div>

      <Button
        variant="outline"
        fullWidth
        size="lg"
        onClick={() => toast.info("Google sign-in: próximamente")}
        id="btn-login-google"
        className="mb-6 bg-surface-container-lowest! text-on-surface!"
      >
        <span className="inline-flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          {t("login.continueWithGoogle")}
        </span>
      </Button>

      <div className="relative mb-8" aria-hidden="true">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-surface-container-lowest text-on-surface-variant">{t("login.orWithEmail")}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div role="alert" className="bg-danger-container text-on-danger-container p-3 rounded-xl text-sm border border-danger/20">
            {error}
          </div>
        )}

        <Input
          type="email"
          id="input-login-email"
          label={t("login.email")}
          autoComplete="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={t("login.emailPlaceholder")}
        />
        <Input
          type="password"
          id="input-login-password"
          label={t("login.password")}
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder={t("login.passwordPlaceholder")}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant">
            <input id="input-login-remember" type="checkbox" className="rounded border-outline-variant text-primary focus-visible:ring-primary" />
            <span>{t("login.rememberMe")}</span>
          </label>
          <Link href="/auth/recuperar" id="link-login-forgot" className="text-primary hover:underline font-medium">
            {t("login.forgotPassword")}
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} id="btn-login-submit" iconRight={!isLoading ? <ArrowRight size={18} /> : undefined}>
          {isLoading ? t("login.submitting") : t("login.submit")}
        </Button>
      </form>

      <p className="mt-8 text-center text-on-surface-variant">
        {t("login.noAccount")}{" "}
        <Link href="/auth/registro" id="link-to-register" className="text-primary font-bold hover:underline">
          {t("login.signUpFree")}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-surface-container-lowest relative">
      <Link href="/" className="absolute top-8 left-8 z-50 font-serif text-2xl font-bold tracking-tighter text-volcano-black lg:text-nica-white transition-colors hover:text-oro-indigena">
        Momotombo <span className="font-light italic">Travels</span>
      </Link>

      <div className="hidden lg:block lg:w-1/2 relative h-screen p-4">
        <AuthCarousel />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <Container size="md" className="max-w-md! p-0!">
          <Suspense fallback={<div className="animate-pulse h-64 w-full bg-surface-container rounded-xl" aria-label="Loading login form" />}>
            <LoginForm />
          </Suspense>
        </Container>
      </div>
    </div>
  );
}
