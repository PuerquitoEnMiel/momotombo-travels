import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

export const metadata: Metadata = {
  title: "Blog de Viajes: Rutas y Tips por Nicaragua",
  description:
    "Historias, guías de viaje, consejos prácticos y rutas recomendadas para descubrir Nicaragua como un experto. Inspiración premium para tu próxima aventura.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Blog de Viajes: Rutas y Tips por Nicaragua",
    description:
      "Historias, guías de viaje, consejos prácticos y rutas recomendadas para descubrir Nicaragua como un experto. Inspiración premium para tu próxima aventura.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
