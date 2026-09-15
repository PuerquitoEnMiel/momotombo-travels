"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Container, Spinner, EmptyState, Card, CardBody } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { blogsService } from "@/services/blogs.service";
import type { BlogPost } from "@/types/blog";

dayjs.locale("es");

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Guía Definitiva para Escalar el Volcán Maderas",
    slug: "guia-definitiva-volcan-maderas",
    excerpt: "Descubre los secretos mejor guardados y la preparación necesaria para conquistar este coloso en la Isla de Ometepe.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    published: true,
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "2",
    title: "5 Playas Escondidas en San Juan del Sur",
    slug: "5-playas-escondidas-san-juan-del-sur",
    excerpt: "Más allá de la bahía principal, existen paraísos vírgenes esperando ser descubiertos por los amantes del surf.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    published: true,
    createdAt: "2026-05-28T14:30:00Z",
    updatedAt: "2026-05-28T14:30:00Z",
  },
  {
    id: "3",
    title: "Cultura y Tradición: El Güegüense",
    slug: "cultura-tradicion-el-gueguense",
    excerpt: "Un análisis profundo de la obra maestra del patrimonio oral e inmaterial de la humanidad originaria de Diriamba.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    published: true,
    createdAt: "2026-05-15T09:15:00Z",
    updatedAt: "2026-05-15T09:15:00Z",
  },
];

export default function BlogPage() {
  const { t } = useTranslation("blog");
  const toast = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await blogsService.list();
        if (!cancelled) setPosts(data);
      } catch {
        // Use fallback if backend unavailable
        if (!cancelled) setPosts(FALLBACK_POSTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayPosts = posts.length > 0 ? posts : FALLBACK_POSTS;

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-container-low flex items-center justify-center" role="status" aria-label={t("title")}>
        <Spinner size="xl" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-container-low pt-24 pb-16">
      <header className="bg-surface-container-lowest py-16 border-b border-outline-variant/30">
        <Container size="lg" className="text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} aria-hidden="true" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-on-surface mb-6 text-balance">
            {t("title")}
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed text-pretty">
            {t("subtitle")}
          </p>
        </Container>
      </header>

      <Container size="lg" className="mt-12 mb-16">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-nica-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />

          <div className="relative z-10 md:flex items-center justify-between gap-8">
            <div className="md:max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkle size={20} className="text-oro-indigena" aria-hidden="true" />
                <span className="font-bold text-oro-indigena tracking-widest text-sm uppercase">{t("newBadge")}</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">{t("aiCta.title")}</h2>
              <p className="text-nica-white/80 text-lg mb-8 md:mb-0 leading-relaxed text-pretty">
                {t("aiCta.description")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new Event("open-chat"));
                toast.info("Kary está en camino...");
              }}
              id="btn-generate-blog-ai"
              className="bg-surface-container-lowest text-volcano-black hover:text-primary hover:scale-105 active:scale-[0.97] transition-all duration-300 ease-out-expo px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro-indigena"
            >
              <Sparkle size={20} className="text-primary" aria-hidden="true" />
              {t("aiCta.button")}
            </button>
          </div>
        </div>
      </Container>

      <Container size="lg">
        {displayPosts.length === 0 ? (
          <EmptyState
            title="No hay artículos disponibles"
            description="Vuelve pronto para descubrir nuevas historias."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <Card interactive className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" aria-hidden="true" />
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out-expo"
                    />
                  </div>
                  <CardBody className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-3">
                      <Calendar size={14} aria-hidden="true" />
                      <time dateTime={post.createdAt}>{dayjs(post.createdAt).format("DD MMMM YYYY")}</time>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-2 text-balance">
                      {post.title}
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed mb-4 flex-1 line-clamp-3 text-pretty">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      id={`link-read-article-${post.slug}`}
                      className="inline-flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all duration-200 ease-out-expo active:scale-[0.97] focus-visible:outline focus-visible:underline"
                    >
                      {t("article.readMore")} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </CardBody>
                </Card>
              </motion.article>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
