import type { Metadata } from "next";
import { API_URL } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

type Props = { params: Promise<{ slug: string }> };

interface DestinationImageDto {
  url?: string;
  altText?: string;
  isHero?: boolean;
}

interface DestinationDto {
  name?: string;
  slug?: string;
  description?: string;
  rating?: number;
  location?: Record<string, unknown> | null;
  images?: DestinationImageDto[];
  reviews?: unknown[];
}

async function fetchDestination(slug: string): Promise<DestinationDto | null> {
  try {
    const res = await fetch(
      `${API_URL}/destinations/${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as DestinationDto;
  } catch {
    // Metadata must never break rendering: the page handles notFound().
    return null;
  }
}

function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function buildDescription(destination: DestinationDto): string {
  const raw = destination.description?.replace(/\s+/g, " ").trim();
  if (raw && raw.length >= 120) return truncate(raw, 158);
  return `Descubre ${destination.name} en Nicaragua con Momotombo Travels: tours con guías locales, itinerarios a medida, actividades exclusivas y reservas seguras.`;
}

function getCoordinates(
  location: DestinationDto["location"],
): { latitude: number; longitude: number } | null {
  if (!location) return null;
  const latitude = Number(location.lat ?? location.latitude);
  const longitude = Number(location.lng ?? location.longitude ?? location.lon);
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return { latitude, longitude };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `${SITE_URL}/explorar/${encodeURIComponent(slug)}`;
  const destination = await fetchDestination(slug);

  if (!destination?.name) {
    return {
      title: "Destinos y Tours en Nicaragua",
      description:
        "Descubre destinos, tours y experiencias únicas en Nicaragua con guías locales, recomendaciones premium y reservas sencillas en Momotombo Travels.",
      alternates: { canonical },
      robots: { index: true, follow: true },
    };
  }

  const title = `${destination.name} — Tours, Guías y Reservas`;
  const description = buildDescription(destination);

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function DestinationDetailLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { slug } = await params;
  const destination = await fetchDestination(slug);

  let jsonLd: Record<string, unknown> | null = null;
  if (destination?.name) {
    const canonical = `${SITE_URL}/explorar/${encodeURIComponent(slug)}`;
    const image = toAbsoluteUrl(
      destination.images?.find((img) => img.isHero)?.url ??
        destination.images?.[0]?.url,
    );
    const geo = getCoordinates(destination.location);
    const rating = Number(destination.rating);
    const reviewCount = Array.isArray(destination.reviews)
      ? destination.reviews.length
      : 0;

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      name: destination.name,
      description: destination.description,
      url: canonical,
      ...(image ? { image } : {}),
      address: {
        "@type": "PostalAddress",
        addressCountry: "Nicaragua",
      },
      ...(geo
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: geo.latitude,
              longitude: geo.longitude,
            },
          }
        : {}),
      ...(Number.isFinite(rating) && rating > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: rating,
              bestRating: 5,
              worstRating: 1,
              ...(reviewCount > 0 ? { ratingCount: reviewCount } : {}),
            },
          }
        : {}),
    };
  }

  return (
    <>
      {children}
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </>
  );
}
