import type { Metadata } from "next";
import { API_URL } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

type Props = { params: Promise<{ slug: string }> };

interface BlogPostDto {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  author?: { name?: string } | string | null;
  destination?: { name?: string; slug?: string };
}

async function fetchPost(slug: string): Promise<BlogPostDto | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as BlogPostDto;
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

function getAuthorName(author: BlogPostDto["author"]): string {
  if (typeof author === "string" && author.trim()) return author.trim();
  if (author && typeof author === "object" && author.name) return author.name;
  return "Momotombo Travels";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
  const post = await fetchPost(slug);

  if (!post?.title) {
    return {
      title: "Blog de Viajes",
      description:
        "Guías de viaje, rutas recomendadas, consejos prácticos y relatos inspiradores para descubrir Nicaragua con Momotombo Travels.",
      alternates: { canonical },
      robots: { index: true, follow: true },
    };
  }

  const title = truncate(post.metaTitle ?? post.title, 70);
  const rawDescription = post.metaDescription ?? post.excerpt;
  const description =
    rawDescription && rawDescription.trim().length >= 60
      ? truncate(rawDescription, 158)
      : `Lee "${post.title}" en el blog de Momotombo Travels: guías, rutas y consejos premium para disfrutar Nicaragua como un experto local.`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt ?? post.createdAt,
    },
  };
}

export default async function BlogPostLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  let jsonLd: Record<string, unknown> | null = null;
  if (post?.title) {
    const canonical = `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
    const image = toAbsoluteUrl(post.coverImage);
    const description = post.metaDescription ?? post.excerpt;

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.metaTitle ?? post.title,
      description,
      ...(image ? { image } : {}),
      ...(post.createdAt ? { datePublished: post.createdAt } : {}),
      ...((post.updatedAt ?? post.createdAt)
        ? { dateModified: post.updatedAt ?? post.createdAt }
        : {}),
      author: {
        "@type": "Person",
        name: getAuthorName(post.author),
      },
      publisher: {
        "@type": "Organization",
        name: "Momotombo Travels",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icons/icon.svg`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
      url: canonical,
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
