import { API_URL } from "@/lib/api";

export const revalidate = 3600; // cached, refreshed hourly (not build-frozen)

// `request.url` may point at any host (build, preview, Cloud Run) — use the
// configured site URL (same source as robots.ts) for the generated <loc> entries.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

interface SitemapEntry {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  lastmod?: string;
}

// Only indexable, public routes. Private areas (perfil, checkout, bookings,
// planificar, itinerarios, proveedores, admin, auth) are noindex and must not
// appear here — contradictory signals hurt crawling.
const STATIC_ROUTES: SitemapEntry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/explorar", priority: 0.9, changeFrequency: "daily" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/terminos", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" },
  { path: "/institucional/quienes-somos", priority: 0.4, changeFrequency: "monthly" },
];

/**
 * API list endpoints may return a bare array or a wrapper object
 * (`{ items: [...] }`, `{ data: [...] }`, `{ results: [...] }`, …).
 * Normalize either shape to an array of records with a string `slug`.
 */
function extractSlugRecords(
  payload: unknown,
): Array<{ slug: string; updatedAt?: string }> {
  let list: unknown;
  if (Array.isArray(payload)) {
    list = payload;
  } else if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    list = [record.items, record.data, record.results, record.destinations, record.blogs].find(
      (candidate) => Array.isArray(candidate)
    );
  }
  if (!Array.isArray(list)) return [];
  return list.filter(
    (item): item is { slug: string; updatedAt?: string } =>
      !!item &&
      typeof item === "object" &&
      typeof (item as { slug?: unknown }).slug === "string"
  );
}

async function fetchDynamicRoutes(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  try {
    const [destsRes, blogsRes] = await Promise.all([
      fetch(`${API_URL}/destinations`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/blogs`, { next: { revalidate: 3600 } }).catch(() => null),
    ]);

    if (destsRes?.ok) {
      for (const d of extractSlugRecords(await destsRes.json().catch(() => null))) {
        entries.push({
          path: `/explorar/${d.slug}`,
          priority: 0.8,
          changeFrequency: "weekly",
          lastmod: d.updatedAt,
        });
      }
    }

    if (blogsRes?.ok) {
      for (const b of extractSlugRecords(await blogsRes.json().catch(() => null))) {
        entries.push({
          path: `/blog/${b.slug}`,
          priority: 0.7,
          changeFrequency: "monthly",
          lastmod: b.updatedAt,
        });
      }
    }
  } catch {
    // Fall back to static routes only
  }

  return entries;
}

function xmlEscape(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const origin = BASE_URL.replace(/\/$/, "");
  const dynamicRoutes = await fetchDynamicRoutes();
  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
  const today = new Date().toISOString().split("T")[0];

  const urls = allRoutes
    .map((r) => {
      // Real lastmod when known (content entities carry updatedAt); the
      // uniform "today for everything" fake lastmod devalues the signal.
      const lastmod = r.lastmod
        ? new Date(r.lastmod).toISOString().split("T")[0]
        : today;
      return `  <url>
    <loc>${xmlEscape(`${origin}${r.path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changeFrequency}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
