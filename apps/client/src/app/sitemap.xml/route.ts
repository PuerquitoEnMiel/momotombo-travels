import { API_URL } from "@/lib/api";

export const dynamic = "force-static";
export const revalidate = 3600; // refresh every hour

interface SitemapEntry {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

const STATIC_ROUTES: SitemapEntry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/explorar", priority: 0.9, changeFrequency: "daily" },
  { path: "/planificar", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/itinerarios", priority: 0.7, changeFrequency: "weekly" },
  { path: "/auth/login", priority: 0.5, changeFrequency: "monthly" },
  { path: "/auth/registro", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terminos", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" },
  { path: "/institucional/quienes-somos", priority: 0.4, changeFrequency: "monthly" },
  { path: "/institucional/contacto", priority: 0.4, changeFrequency: "monthly" },
];

async function fetchDynamicRoutes(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  try {
    const [destsRes, blogsRes] = await Promise.all([
      fetch(`${API_URL}/destinations`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/blogs`, { next: { revalidate: 3600 } }).catch(() => null),
    ]);

    if (destsRes?.ok) {
      const dests = (await destsRes.json()) as Array<{ slug: string }>;
      for (const d of dests) {
        if (d?.slug) entries.push({ path: `/explorar/${d.slug}`, priority: 0.8, changeFrequency: "weekly" });
      }
    }

    if (blogsRes?.ok) {
      const blogs = (await blogsRes.json()) as Array<{ slug: string }>;
      for (const b of blogs) {
        if (b?.slug) entries.push({ path: `/blog/${b.slug}`, priority: 0.7, changeFrequency: "monthly" });
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

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const dynamicRoutes = await fetchDynamicRoutes();
  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = allRoutes
    .map(
      (r) => `  <url>
    <loc>${xmlEscape(`${origin}${r.path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changeFrequency}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
    )
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
