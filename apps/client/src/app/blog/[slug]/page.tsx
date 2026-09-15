"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { ArrowLeft, Calendar, MapPin, Clock, BookOpen, ShareNetwork, TwitterLogo, FacebookLogo } from "@phosphor-icons/react";
import { Button, Card, CardBody, Container, Spinner, EmptyState, ErrorState } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { blogsService } from "@/services/blogs.service";
import type { BlogPost } from "@/types/blog";

dayjs.locale("es");

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const toast = useToast();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await blogsService.getBySlug(slug);
        if (!cancelled) {
          setPost(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = post?.title || "Artículo de Momotombo Travels";
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        /* cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24">
        <Spinner size="xl" />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen pt-24">
        <Container size="md" className="py-16">
          <ErrorState
            title="Artículo no encontrado"
            description="El artículo que buscas no existe o fue movido."
            onRetry={() => (window.location.href = "/blog")}
          />
        </Container>
      </main>
    );
  }

  const readTime = Math.max(1, Math.round(post.content.split(/\s+/).length / 200)) || 5;

  return (
    <main className="min-h-screen bg-surface-container-lowest pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-6">
        <Link
          href="/blog"
          id="btn-back-blog"
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al blog
        </Link>

        <header className="mb-8">
          {post.destination && (
            <Link
              href={`/explorar/${post.destination.slug}`}
              id="link-blog-destination"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline mb-3"
            >
              <MapPin size={14} weight="fill" />
              {post.destination.name}
            </Link>
          )}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface mb-4 text-balance leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed text-pretty mb-6">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} aria-hidden="true" />
              <time dateTime={post.createdAt}>{dayjs(post.createdAt).format("DD MMMM YYYY")}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" />
              <span>{readTime} min lectura</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              id="btn-blog-share"
              iconLeft={<ShareNetwork size={14} />}
              className="!text-on-surface-variant hover:!text-primary"
            >
              Compartir
            </Button>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-10 shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {post.content ? (
            <div
              className="text-on-surface leading-relaxed text-pretty"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <Card>
              <CardBody>
                <EmptyState
                  icon={<BookOpen size={28} weight="duotone" />}
                  title="Contenido en preparación"
                  description="Este artículo está siendo editado. Vuelve pronto para descubrir el contenido completo."
                />
              </CardBody>
            </Card>
          )}
        </div>

        <footer className="mt-12 pt-8 border-t border-outline-variant">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-on-surface-variant">¿Te gustó este artículo? Compártelo:</p>
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartir en Twitter"
                id="btn-blog-share-twitter"
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors text-on-surface"
              >
                <TwitterLogo size={18} weight="fill" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartir en Facebook"
                id="btn-blog-share-facebook"
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors text-on-surface"
              >
                <FacebookLogo size={18} weight="fill" />
              </a>
              <Button
                variant="primary"
                size="sm"
                onClick={handleShare}
                iconLeft={<ShareNetwork size={14} />}
                id="btn-blog-share-copy"
              >
                Copiar enlace
              </Button>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
