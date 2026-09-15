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
        <Container size="md" className="!max-w-md !p-0">
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
              className="mb-6 !bg-surface-container-lowest !text-on-surface"
            >
              <span className="inline-flex items-center gap-2">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="w-5 h-5" />
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
