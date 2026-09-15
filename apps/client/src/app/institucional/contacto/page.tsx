"use client";

import { useTranslation } from "react-i18next";
import { Container, Card, CardBody } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ContactoPage() {
  const { t } = useTranslation("common");

  return (
    <main className="pt-24 min-h-screen bg-surface-container-low">
      <Container size="md" className="py-12">
        <PageHeader
          title="Contáctanos"
          description="¿Tienes alguna pregunta o quieres formar parte de nuestra red de proveedores?"
          className="mb-10"
        />
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <p className="text-on-surface-variant">
                {t("comingSoon")}. Escríbenos a <a href="mailto:hola@momotombo.travel" className="text-primary font-medium hover:underline">hola@momotombo.travel</a>
              </p>
            </div>
          </CardBody>
        </Card>
      </Container>
    </main>
  );
}
