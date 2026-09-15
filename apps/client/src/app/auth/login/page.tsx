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
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="w-5 h-5" />
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
