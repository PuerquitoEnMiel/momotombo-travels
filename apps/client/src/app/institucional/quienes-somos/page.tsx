"use client";

import { Container, Card, CardBody } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { Heart, MapPin, Sparkle, Users } from "@phosphor-icons/react";

const VALUES = [
  {
    icon: Heart,
    title: "Autenticidad",
    description: "Promovemos experiencias genuinas que reflejan la verdadera cultura nicaragüense.",
  },
  {
    icon: MapPin,
    title: "Localismo",
    description: "Apoyamos a proveedores y guías locales, asegurando que el turismo beneficie a las comunidades.",
  },
  {
    icon: Sparkle,
    title: "Innovación",
    description: "Usamos IA de manera responsable para personalizar cada viaje sin reemplazar el toque humano.",
  },
  {
    icon: Users,
    title: "Comunidad",
    description: "Construimos una comunidad de viajeros responsables que respetan la naturaleza y la cultura.",
  },
];

export default function QuienesSomosPage() {
  return (
    <main className="min-h-screen bg-surface-container-low pt-24 pb-16">
      <Container size="md" className="py-12">
        <PageHeader
          eyebrow="Sobre nosotros"
          title="Nacimos para democratizar el turismo en Nicaragua"
          description="Creemos que cada viajero merece descubrir la autenticidad de nuestra tierra."
          backHref="/"
          className="mb-10"
        />

        <Card className="mb-8">
          <CardBody>
            <h2 className="font-serif text-2xl font-bold text-on-surface mb-4 text-balance">Nuestra historia</h2>
            <div className="space-y-4 text-on-surface-variant leading-relaxed text-pretty">
              <p>
                Momotombo Travels nació de una frustración personal: la dificultad de encontrar información confiable
                y actualizada sobre destinos nicaragüenses. Combinamos tecnología de inteligencia artificial con la
                experiencia de guías locales para crear itinerarios personalizados que respetan el tiempo, el presupuesto
                y los intereses de cada viajero.
              </p>
              <p>
                Somos un equipo pequeño pero diverso: desarrolladores, diseñadores y expertos en turismo que compartimos
                la pasión por mostrar lo mejor de Nicaragua al mundo. Trabajamos directamente con proveedores locales
                para asegurar experiencias auténticas y de calidad.
              </p>
            </div>
          </CardBody>
        </Card>

        <h2 className="font-serif text-2xl font-bold text-on-surface mb-6 text-balance">Nuestros valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardBody>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={24} weight="duotone" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-lg font-bold text-on-surface mb-2">{title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed text-pretty">{description}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <Card className="!bg-gradient-to-br !from-volcano-black !to-gray-800 !text-nica-white !border-0">
          <CardBody>
            <h2 className="font-serif text-2xl font-bold mb-3 text-balance">Nuestra misión</h2>
            <p className="text-gray-300 leading-relaxed text-pretty">
              Hacer de Nicaragua el destino más accesible y auténtico de Centroamérica, conectando viajeros
              con experiencias que transforman y que benefician a las comunidades locales.
            </p>
          </CardBody>
        </Card>
      </Container>
    </main>
  );
}
