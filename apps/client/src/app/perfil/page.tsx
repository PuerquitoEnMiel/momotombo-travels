"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Envelope, Heart, MapTrifold, Star, SignOut, NotePencil, Camera, Sparkle, Trophy, Medal } from "@phosphor-icons/react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Spinner, ErrorState, Avatar, Badge, Button, Card, CardBody, CardHeader, Container, EmptyState } from "@/components/ui";
import type { Icon } from "@phosphor-icons/react";

function StatCard({ icon: Icon, label, value, color }: { icon: Icon; label: string; value: string | number; color: string }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-nica-white`}>
      <div className="flex items-center justify-between mb-3">
        <Icon size={20} className="opacity-80" aria-hidden="true" />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm opacity-80 font-medium">{label}</p>
    </div>
  );
}

export default function PerfilPage() {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const { user, gamification, loading, error, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-container-low flex items-center justify-center" role="status" aria-label={t("loading")}>
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" />
          <p className="text-on-surface-variant animate-pulse text-sm">{t("loading")}</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <ErrorState description={error} onRetry={() => router.push("/auth/login")} />
      </main>
    );
  }

  if (!user) return null;

  const progressPercentage = gamification ? Math.min((gamification.points / gamification.nextLevelThreshold) * 100, 100) : 0;

  const stats: Array<{ icon: Icon; label: string; value: number; color: string }> = [
    { icon: Heart, label: t("stats.favorites"), value: 0, color: "from-danger to-rose-700" },
    { icon: MapTrifold, label: t("stats.visited"), value: 0, color: "from-primary to-primary-container" },
    { icon: Star, label: t("stats.reviews"), value: 0, color: "from-oro-indigena to-yellow-700" },
    { icon: Sparkle, label: t("stats.aiItineraries"), value: 0, color: "from-secondary to-secondary-container" },
  ];

  return (
    <main className="min-h-screen bg-surface-container-low">
      <header className="relative bg-volcano-black pt-32 pb-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(0,71,186,0.8) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(0,128,85,0.8) 0%, transparent 60%)" }}
          aria-hidden="true"
        />
        <Container size="md" className="relative z-10 flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative">
            <Avatar
              src={null}
              name={user.name}
              size="2xl"
              ringClassName="border-4 border-white/10 shadow-2xl"
            />
            <button
              type="button"
              className="absolute bottom-1 right-1 w-8 h-8 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={t("editProfile")}
            >
              <Camera size={14} className="text-on-surface" />
            </button>
          </div>

          <div className="pb-1 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-nica-white text-balance">{user.name}</h1>
              {user.role === "ADMIN" && (
                <Badge variant="warning" size="sm">ADMIN</Badge>
              )}
            </div>
            <p className="text-gray-400 flex items-center gap-1.5 text-sm">
              <Envelope size={14} aria-hidden="true" />
              {user.email}
            </p>

            {gamification && (
              <div className="mt-4 max-w-sm">
                <div className="flex justify-between items-center text-xs text-oro-indigena font-bold mb-1">
                  <span className="flex items-center gap-1">
                    <Trophy size={12} aria-hidden="true" /> {gamification.points} XP
                  </span>
                  <span>{t("gamification.nextLevel", { xp: gamification.nextLevelThreshold })}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className="h-full bg-gradient-to-r from-oro-indigena to-secondary rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pb-1 md:ml-auto">
            <Button variant="glass" size="sm" id="btn-edit-profile" iconLeft={<NotePencil size={14} />}>
              {t("editProfile")}
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={() => {
                logout();
                router.push("/");
              }}
              id="btn-logout"
              iconLeft={<SignOut size={14} />}
              className="!text-danger !border-danger/30 hover:!bg-danger-container/30"
            >
              {t("logout")}
            </Button>
          </div>
        </Container>
      </header>

      <Container size="md" className="py-10">
        {gamification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
                    <Medal size={20} className="text-oro-indigena" aria-hidden="true" />
                    {t("gamification.title")}
                  </h2>
                  <Badge variant="primary" size="sm">
                    {t("gamification.unlocked", { count: gamification.earnedBadges.length })}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {gamification.earnedBadges.map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center text-center p-4 bg-gradient-to-b from-oro-indigena/10 to-surface-container-lowest rounded-2xl border border-oro-indigena/20">
                      <div className="w-12 h-12 bg-oro-indigena text-nica-white rounded-full flex items-center justify-center mb-3 shadow-md">
                        <Trophy size={20} aria-hidden="true" />
                      </div>
                      <span className="font-bold text-on-surface text-sm mb-1">{badge.name}</span>
                      <span className="text-xs text-on-surface-variant">{badge.description}</span>
                    </div>
                  ))}

                  {gamification.availableBadges.map((badge) => (
                    <div key={`locked-${badge.id}`} className="flex flex-col items-center text-center p-4 bg-surface-container rounded-2xl border border-outline-variant opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                      <div className="w-12 h-12 bg-outline-variant text-on-surface-variant rounded-full flex items-center justify-center mb-3">
                        <Medal size={20} aria-hidden="true" />
                      </div>
                      <span className="font-bold text-on-surface text-sm mb-1">{badge.name}</span>
                      <span className="text-xs text-on-surface-variant">{badge.description}</span>
                    </div>
                  ))}

                  {gamification.earnedBadges.length === 0 && gamification.availableBadges.length === 0 && (
                    <div className="col-span-full py-8 text-center text-on-surface-variant text-sm">
                      {t("gamification.empty")}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
                    <Heart size={18} className="text-danger" aria-hidden="true" />
                    {t("favorites.title")}
                  </h2>
                  <Link href="/explorar" className="text-primary text-sm hover:underline font-medium">
                    {t("favorites.empty.cta")}{" "}→
                  </Link>
                </div>
              </CardHeader>
              <CardBody>
                <EmptyState
                  icon={<Heart size={28} weight="duotone" />}
                  title={t("favorites.empty.title")}
                  description={t("favorites.empty.description")}
                  action={{
                    label: t("favorites.empty.cta"),
                    onClick: () => router.push("/explorar"),
                  }}
                />
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <h2 className="font-serif text-xl font-bold text-on-surface">{t("quickActions.title")}</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {[
                    { id: "btn-quick-chat", icon: Sparkle, label: t("quickActions.ai"), action: () => window.dispatchEvent(new Event("open-chat")) },
                    { id: "btn-quick-explore", icon: MapTrifold, label: t("quickActions.explore"), href: "/explorar" },
                    { id: "btn-quick-itineraries", icon: Star, label: t("quickActions.itineraries"), href: "/itinerarios" },
                  ].map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors duration-200 text-left group">
                        <div className="w-9 h-9 rounded-xl bg-surface-container text-on-surface-variant group-hover:scale-110 transition-transform flex items-center justify-center">
                          <Icon size={16} aria-hidden="true" />
                        </div>
                        <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{item.label}</span>
                      </div>
                    );
                    return item.href ? (
                      <Link key={item.id} id={item.id} href={item.href} className="block active:scale-[0.98] transition-transform">
                        {content}
                      </Link>
                    ) : (
                      <button key={item.id} id={item.id} type="button" onClick={item.action} className="w-full active:scale-[0.98] transition-transform">
                        {content}
                      </button>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </Container>
    </main>
  );
}
