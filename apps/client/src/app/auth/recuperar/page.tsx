"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Envelope, ArrowRight, CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { Button, Input, Container, Card, CardBody } from "@/components/ui";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/hooks/useToast";
import { API_URL } from "@/lib/api";

function ForgotForm() {
  const { t } = useTranslation("auth");
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Treat any response as success to avoid email enumeration
      if (res.ok) {
        setSent(true);
        toast.success("Si el email existe, recibirás un enlace de recuperación");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "No pudimos procesar la solicitud");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success-container text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} weight="duotone" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">Revisa tu correo</h2>
            <p className="text-on-surface-variant mb-6 text-pretty">
              Si el email <strong>{email}</strong> está registrado, te enviamos un enlace para restablecer tu contraseña.
            </p>
            <Link href="/auth/login" id="link-back-login">
              <Button variant="outline">Volver al inicio de sesión</Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <div className="mb-6 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck size={20} weight="duotone" />
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Por seguridad, no confirmamos si un email está registrado. Te enviaremos el enlace solo si existe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div role="alert" className="bg-danger-container text-on-danger-container p-3 rounded-xl text-sm border border-danger/20">
              {error}
            </div>
          )}
          <Input
            type="email"
            id="input-forgot-email"
            label={t("login.email")}
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.emailPlaceholder")}
            iconLeft={<Envelope size={18} />}
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            id="btn-forgot-submit"
            iconRight={!loading ? <ArrowRight size={18} /> : undefined}
          >
            {t("forgotPassword.submit")}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

function ForgotFallback() {
  return (
    <Card>
      <CardBody>
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      </CardBody>
    </Card>
  );
}

export default function ForgotPasswordPage() {
  const { t } = useTranslation("auth");

  return (
    <div className="min-h-screen flex bg-surface-container-lowest">
      <div className="w-full flex flex-col justify-center items-center p-6 md:p-12">
        <Container size="sm" className="!max-w-md !p-0">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tighter text-volcano-black mb-10 block text-center"
          >
            Momotombo <span className="font-light italic">Travels</span>
          </Link>

          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-volcano-black mb-2 text-balance">
              {t("forgotPassword.title")}
            </h1>
            <p className="text-on-surface-variant text-pretty">{t("forgotPassword.subtitle")}</p>
          </div>

          <Suspense fallback={<ForgotFallback />}>
            <ForgotForm />
          </Suspense>

          <p className="mt-6 text-center text-sm">
            <Link href="/auth/login" id="link-forgot-back" className="text-primary font-medium hover:underline">
              {t("forgotPassword.backToLogin")}
            </Link>
          </p>
        </Container>
      </div>
    </div>
  );
}
