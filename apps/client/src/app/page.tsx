import { Hero } from "@/components/features/hero/Hero";
import { ChatWidget } from "@/components/features/ai-guide/ChatWidget";
import { BentoPreview } from "@/components/features/home/BentoPreview";
import { FeaturedDestinations } from "@/components/features/home/FeaturedDestinations";
import { HowItWorks } from "@/components/features/home/HowItWorks";
import { AtelierPlanner } from "@/components/features/home/AtelierPlanner";
import { Manifesto } from "@/components/features/home/Manifesto";
import { FAQ } from "@/components/features/home/FAQ";
import { PressLogos } from "@/components/features/home/PressLogos";
import { Newsletter } from "@/components/features/home/Newsletter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

// Structured data for rich results. Keep in sync with FAQ.tsx content.
const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: "Momotombo Travels",
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon.svg`,
    description:
      "Expediciones, tours e itinerarios personalizados por Nicaragua: volcanes activos, islas, selva y costa pacífica.",
    areaServed: { "@type": "Country", name: "Nicaragua" },
    priceRange: "$$$",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Momotombo Travels",
    url: SITE_URL,
    inLanguage: "es",
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cómo funciona el acompañamiento de vulcanólogos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Todas nuestras ascensiones a cráteres activos (como el Volcán Telica, Cerro Negro o Masaya) están supervisadas por guías locales experimentados y especialistas en vulcanología, con equipo de monitoreo de gases y comunicación satelital de respaldo.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo modificar el itinerario propuesto por la IA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Totalmente. La inteligencia artificial elabora la base topográfica y logística óptima; posteriormente, un diseñador de viajes sénior de nuestro equipo afina cada detalle según tu ritmo y preferencias individuales.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué tipo de traslados internos se utilizan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Utilizamos vehículos todoterreno de lujo con chóferes profesionales, hidroaviones y lanchas rápidas privadas para el archipiélago de Solentiname y las isletas de Granada.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué destinos puedo encontrar en Momotombo Travels?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nos especializamos en Nicaragua, cubriendo desde las joyas coloniales de Granada y León, hasta la geología sagrada de Ometepe, el surf de Costa Esmeralda y el descanso caribeño en Corn Island.",
        },
      },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(STRUCTURED_DATA),
        }}
      />
      <Hero />
      <BentoPreview />
      <FeaturedDestinations />
      <HowItWorks />
      <AtelierPlanner />
      <Manifesto />
      <FAQ />
      <PressLogos />
      <Newsletter />
      <ChatWidget />
    </main>
  );
}
