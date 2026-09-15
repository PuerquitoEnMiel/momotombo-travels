"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation, Trans } from "react-i18next";
import { AuthCarousel } from "@/components/features/auth/AuthCarousel";
import { Button, Input, Container } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { ApiException } from "@/types/api";

export default function RegistroPage() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateField = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await register(formData);
      setSuccess(true);
      toast.success(t("login.registeredSuccess"));
      setTimeout(() => router.push("/auth/login?registered=true"), 1500);
    } catch (err) {
      let message = t("register.errors.generic");
      if (err instanceof ApiException) {
        if (err.statusCode === 409) message = t("register.errors.emailTaken");
        else if (err.message.toLowerCase().includes("password")) message = t("register.errors.weakPassword");
        else message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="w-full">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="font-serif text-4xl font-bold text-volcano-black mb-2 text-balance">{t("register.title")}</h1>
              <p className="text-on-surface-variant">{t("register.subtitle")}</p>
            </div>

            <Button
              variant="outline"
              fullWidth
              size="lg"
              onClick={() => toast.info("Google sign-up: próximamente")}
              id="btn-register-google"
              className="mb-6 bg-surface-container-lowest! text-on-surface!"
            >
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                {t("register.continueWithGoogle")}
              </span>
            </Button>

            <div className="relative mb-8" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container-lowest text-on-surface-variant">{t("register.orWithEmail")}</span>
              </div>
            </div>

            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-success-container text-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} weight="duotone" />
                </div>
                <h3 className="font-bold text-xl text-on-surface mb-2">{t("login.registeredSuccess")}</h3>
                <p className="text-on-surface-variant text-sm">Redirigiendo al inicio de sesión...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {error && (
                  <div role="alert" className="bg-danger-container text-on-danger-container p-3 rounded-xl text-sm border border-danger/20">
                    {error}
                  </div>
                )}

                <Input
                  type="text"
                  id="input-register-name"
                  label={t("register.fullName")}
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={updateField("name")}
                  placeholder={t("register.fullNamePlaceholder")}
                />
                <Input
                  type="email"
                  id="input-register-email"
                  label={t("register.email")}
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={updateField("email")}
                  placeholder={t("login.emailPlaceholder")}
                />
                <Input
                  type="password"
                  id="input-register-password"
                  label={t("register.password")}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={updateField("password")}
                  placeholder={t("login.passwordPlaceholder")}
                />

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <Trans
                    i18nKey="auth:register.termsNotice"
                    values={{ terms: t("register.terms"), privacy: t("register.privacy") }}
                    components={{
                      termsLink: <Link href="/terminos" className="underline hover:text-volcano-black" />,
                      privacyLink: <Link href="/privacidad" className="underline hover:text-volcano-black" />,
                    }}
                  />
                </p>

                <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} id="btn-register-submit" iconRight={!isLoading ? <ArrowRight size={18} /> : undefined}>
                  {isLoading ? t("register.submitting") : t("register.submit")}
                </Button>
              </form>
            )}

            {!success && (
              <p className="mt-8 text-center text-on-surface-variant">
                {t("register.hasAccount")}{" "}
                <Link href="/auth/login" id="link-to-login" className="text-primary font-bold hover:underline">
                  {t("register.signIn")}
                </Link>
              </p>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
