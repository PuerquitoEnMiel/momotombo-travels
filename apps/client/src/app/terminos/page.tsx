"use client";

import { Container, Card, CardBody } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { Scroll, CheckCircle, Warning, Gavel } from "@phosphor-icons/react";

const SECTIONS = [
  {
    id: "aceptacion",
    title: "1. Aceptación de los términos",
    icon: CheckCircle,
    body: "Al acceder y utilizar los servicios de Momotombo Travels, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte, te pedimos no utilizar nuestros servicios.",
  },
  {
    id: "servicios",
    title: "2. Descripción de los servicios",
    icon: Scroll,
    body: "Momotombo Travels es una plataforma que conecta viajeros con destinos, actividades y proveedores locales en Nicaragua. Ofrecemos herramientas de planificación con IA, reservas y guías de viaje.",
  },
  {
    id: "cuentas",
    title: "3. Cuentas de usuario",
    icon: CheckCircle,
    body: "Para acceder a ciertas funciones debes crear una cuenta. Eres responsable de mantener la confidencialidad de tus credenciales y de todas las actividades que ocurran bajo tu cuenta.",
  },
  {
    id: "reservas",
    title: "4. Reservas y pagos",
    icon: Scroll,
    body: "Las reservas están sujetas a disponibilidad. Los precios se muestran en USD e incluyen los impuestos aplicables. Los pagos se procesan a través de Stripe y están sujetos a sus términos.",
  },
  {
    id: "cancelaciones",
    title: "5. Cancelaciones y reembolsos",
    icon: Warning,
    body: "La política de cancelación varía según el proveedor y la actividad. Generalmente, las cancelaciones con más de 48 horas de anticipación son elegibles para reembolso completo.",
  },
  {
    id: "responsabilidad",
    title: "6. Limitación de responsabilidad",
    icon: Gavel,
    body: "Momotombo Travels actúa como intermediario entre viajeros y proveedores. No somos responsables de lesiones, pérdidas o daños durante las actividades reservadas a través de la plataforma.",
  },
  {
    id: "propiedad",
    title: "7. Propiedad intelectual",
    icon: Scroll,
    body: "Todo el contenido de la plataforma (textos, imágenes, logos, código) es propiedad de Momotombo Travels o sus licenciantes y está protegido por leyes de propiedad intelectual.",
  },
  {
    id: "modificaciones",
    title: "8. Modificaciones",
    icon: CheckCircle,
    body: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios significativos por correo electrónico o mediante un aviso en la plataforma.",
  },
  {
    id: "ley",
    title: "9. Ley aplicable",
    icon: Gavel,
    body: "Estos términos se rigen por las leyes de la República de Nicaragua. Cualquier disputa será resuelta por los tribunales competentes de Managua, Nicaragua.",
  },
  {
    id: "contacto",
    title: "10. Contacto",
    icon: Scroll,
    body: "Para preguntas sobre estos términos, escríbenos a hola@momotombo.travel o a nuestra dirección en Managua, Nicaragua.",
  },
];

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-surface-container-low pt-24 pb-16">
      <Container size="md" className="py-12">
        <PageHeader
          eyebrow="Legal"
          title="Términos y Condiciones"
          description="Última actualización: enero 2026. Estos términos rigen el uso de Momotombo Travels."
          backHref="/"
          className="mb-10"
        />

        <div className="space-y-4">
          {SECTIONS.map(({ id, title, icon: Icon, body }) => (
            <Card key={id} id={id}>
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={20} weight="duotone" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-on-surface mb-2 text-balance">{title}</h2>
                    <p className="text-on-surface-variant leading-relaxed text-pretty">{body}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <p className="text-xs text-on-surface-variant text-center mt-12">
          Al usar Momotombo Travels, confirmas que has leído y aceptado estos términos.
        </p>
      </Container>
    </main>
  );
}
