"use client";

import { Container, Card, CardBody } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { Shield, Lock, Eye, Database, ShareNetwork, Envelope, Trash, Download } from "@phosphor-icons/react";

const SECTIONS = [
  {
    id: "recopilacion",
    title: "1. Información que recopilamos",
    icon: Database,
    body: "Recopilamos información que nos proporcionas directamente (nombre, email, perfil) y datos generados durante el uso de la plataforma (itinerarios, reseñas, interacciones con Kary IA).",
  },
  {
    id: "uso",
    title: "2. Cómo usamos tu información",
    icon: Eye,
    body: "Usamos tus datos para personalizar tu experiencia, procesar reservas, mejorar nuestros servicios de IA, enviar comunicaciones relevantes y cumplir con obligaciones legales.",
  },
  {
    id: "proteccion",
    title: "3. Cómo protegemos tu información",
    icon: Lock,
    body: "Implementamos medidas de seguridad técnicas y organizativas: cifrado TLS, autenticación JWT, rate limiting, acceso basado en roles y auditorías periódicas.",
  },
  {
    id: "compartir",
    title: "4. Compartir información con terceros",
    icon: ShareNetwork,
    body: "Compartimos datos solo con proveedores de reservas cuando confirmas una actividad, procesadores de pago (Stripe) y servicios de IA (Google Gemini) que nos ayudan a operar la plataforma.",
  },
  {
    id: "derechos",
    title: "5. Tus derechos (GDPR/LGPD)",
    icon: Shield,
    body: "Tienes derecho a acceder, rectificar, eliminar, portar y restringir el procesamiento de tus datos. Para ejercerlos, escríbenos a privacidad@momotombo.travel.",
  },
  {
    id: "retencion",
    title: "6. Retención de datos",
    icon: Database,
    body: "Conservamos tus datos mientras mantengas una cuenta activa. Después de eliminarla, los datos se anonimizan o eliminan en un plazo de 90 días, salvo obligaciones legales.",
  },
  {
    id: "cookies",
    title: "7. Cookies y tecnologías similares",
    icon: Eye,
    body: "Usamos cookies para autenticación, preferencias de idioma y análisis. Puedes gestionar tus preferencias desde la configuración de tu navegador.",
  },
  {
    id: "transferencias",
    title: "8. Transferencias internacionales",
    icon: ShareNetwork,
    body: "Algunos proveedores de servicios pueden procesar datos fuera de Nicaragua. Garantizamos que cumplen con estándares equivalentes de protección de datos.",
  },
  {
    id: "menores",
    title: "9. Privacidad de menores",
    icon: Shield,
    body: "La plataforma no está dirigida a menores de 13 años. No recopilamos intencionalmente información de niños sin consentimiento parental verificable.",
  },
  {
    id: "cambios",
    title: "10. Cambios a esta política",
    icon: Envelope,
    body: "Notificaremos cualquier cambio material por email y mediante aviso en la plataforma con al menos 30 días de anticipación.",
  },
  {
    id: "exportar",
    title: "11. Exportar y eliminar tus datos",
    icon: Download,
    body: "Puedes solicitar una copia de todos tus datos en formato JSON desde tu perfil, o solicitar su eliminación completa escribiéndonos a privacidad@momotombo.travel.",
  },
  {
    id: "contacto",
    title: "12. Contacto de privacidad",
    icon: Trash,
    body: "Oficial de privacidad: privacidad@momotombo.travel. Dirección: Momotombo Travels S.A., Managua, Nicaragua.",
  },
];

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-surface-container-low pt-24 pb-16">
      <Container size="md" className="py-12">
        <PageHeader
          eyebrow="Legal"
          title="Política de Privacidad"
          description="Última actualización: enero 2026. Tu privacidad es importante para nosotros."
          backHref="/"
          className="mb-10"
        />

        <Card className="mb-6 !bg-info-container/30 !border-info/20">
          <CardBody>
            <p className="text-on-surface leading-relaxed text-pretty">
              <strong>Resumen:</strong> Solo recopilamos lo necesario para brindarte nuestros servicios, nunca vendemos tus datos,
              y te damos control total sobre tu información. Esta política explica los detalles.
            </p>
          </CardBody>
        </Card>

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
      </Container>
    </main>
  );
}
