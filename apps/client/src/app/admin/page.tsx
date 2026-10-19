"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { motion } from "framer-motion";
import { Users, MapPin, CurrencyDollar, Gear, ChartBar, Flag, Shield } from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner, Card, CardBody, CardHeader, EmptyState } from "@/components/ui";
import { Sidebar, type SidebarSection } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/cn";
import { API_URL } from "@/lib/api";
import { api } from "@/services/api";
import { formatMoney } from "@/lib/money";

dayjs.locale("es");

/** Real shapes returned by `GET /admin/dashboard` (see AdminService.getDashboardStats). */
interface AdminDashboardStats {
  users: { total: number; active: number; newLast30Days: number; byRole: Record<string, number> };
  destinations: { total: number };
  bookings: { total: number; last30Days: number; byStatus: Record<string, number> };
  itineraries: { total: number };
  reviews: { total: number; reported: number };
  comments: { flagged: number };
  revenue: { totalUsd: number };
}

/** Real shape returned by `GET /admin/users`. */
interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { t } = useTranslation("admin");
  const router = useRouter();
  const { user, loading } = useAuth();

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUserRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(false);

  const loadDashboard = useCallback(async () => {
    setDataLoading(true);
    setDataError(false);
    try {
      const [statsData, usersData] = await Promise.all([
        api.get<AdminDashboardStats>(`${API_URL}/admin/dashboard`),
        api.get<AdminUserRow[]>(`${API_URL}/admin/users?pageSize=4`),
      ]);
      setStats(statsData);
      setRecentUsers(Array.isArray(usersData) ? usersData : []);
    } catch {
      setStats(null);
      setRecentUsers([]);
      setDataError(true);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && user && user.role === "ADMIN") {
      void loadDashboard();
    }
  }, [loading, user, loadDashboard]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-surface-container-low flex items-center justify-center" role="status">
        <Spinner size="xl" />
      </main>
    );
  }

  // Real metrics from the admin API. Sub-captions are derived, never invented.
  const statCards = stats
    ? [
        {
          label: t("metrics.totalUsers"),
          value: stats.users.total.toLocaleString("es-NI"),
          sub: `${stats.users.newLast30Days} nuevos en los últimos 30 días`,
          icon: Users,
          color: "text-info",
          bg: "bg-info-container",
        },
        {
          label: t("metrics.activeDestinations"),
          value: stats.destinations.total.toLocaleString("es-NI"),
          sub: `${stats.users.active} usuarios activos`,
          icon: MapPin,
          color: "text-secondary",
          bg: "bg-success-container",
        },
        {
          label: t("metrics.monthlyRevenue"),
          value: formatMoney(stats.revenue.totalUsd),
          sub: "Ingresos netos históricos",
          icon: CurrencyDollar,
          color: "text-tertiary-text",
          bg: "bg-warning-container",
        },
        {
          label: t("metrics.registeredGuides"),
          value: (stats.users.byRole.GUIDE ?? 0).toLocaleString("es-NI"),
          sub: `${stats.bookings.total.toLocaleString("es-NI")} reservas en total`,
          icon: Flag,
          color: "text-primary",
          bg: "bg-primary/10",
        },
      ]
    : [];

  const sidebarSections: SidebarSection[] = [
    {
      items: [
        { id: "btn-admin-nav-summary", label: t("nav.summary"), icon: <ChartBar size={18} />, active: true, href: "/admin" },
        { id: "btn-admin-nav-users", label: t("nav.users"), icon: <Users size={18} />, href: "/admin" },
        { id: "btn-admin-nav-destinations", label: t("nav.destinations"), icon: <MapPin size={18} />, href: "/admin/destinos" },
        { id: "btn-admin-nav-transactions", label: t("nav.transactions"), icon: <CurrencyDollar size={18} />, href: "/admin" },
        { id: "btn-admin-nav-settings", label: t("nav.settings"), icon: <Gear size={18} />, href: "/admin" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col md:flex-row pt-20">
      <div className="hidden md:block w-64 shrink-0">
        <Sidebar
          brand={
            <div>
              <h2 className="text-xl font-bold font-serif mb-1 flex items-center gap-2">
                <Shield className="text-primary" size={24} aria-hidden="true" /> {t("title")}
              </h2>
              <p className="text-xs text-on-surface-variant">{t("subtitle")}</p>
            </div>
          }
          sections={sidebarSections}
        />
      </div>

      <main className="flex-1 p-6 md:p-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <PageHeader title={t("metrics.title")} description={t("metrics.subtitle")} className="mb-8" />

          {dataLoading ? (
            <div className="flex items-center justify-center py-20" role="status">
              <Spinner size="lg" />
            </div>
          ) : dataError || !stats ? (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl mb-10">
              <EmptyState
                icon={<ChartBar size={28} weight="duotone" />}
                title="No pudimos cargar las métricas"
                description="Revisa tu conexión e inténtalo de nuevo para ver las métricas de la plataforma."
                action={{ label: "Reintentar", onClick: () => void loadDashboard() }}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.label} className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-on-surface-variant mb-1">{stat.label}</p>
                          <h3 className="text-3xl font-bold text-on-surface">{stat.value}</h3>
                          <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full mt-2 inline-block">
                            {stat.sub}
                          </span>
                        </div>
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                          <Icon size={24} aria-hidden="true" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-on-surface">{t("chart.title")}</h3>
                      <span className="text-xs text-on-surface-variant italic">{t("chart.disclaimer")}</span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="h-64 flex items-end justify-between gap-2" role="img" aria-label="Gráfico de ingresos anuales (datos simulados)">
                      {[40, 60, 45, 80, 50, 90, 100, 85, 70, 95, 110, 120].map((h, i) => (
                        <div key={i} className="flex-1 bg-linear-to-t from-primary/20 to-primary rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant mt-4 font-medium uppercase" aria-hidden="true">
                      <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-on-surface">{t("recentUsers.title")}</h3>
                      <button id="link-admin-users-all" className="text-sm font-bold text-primary hover:underline focus-visible:underline">
                        {t("recentUsers.viewAll")}
                      </button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {recentUsers.length === 0 ? (
                      <p className="text-sm text-on-surface-variant py-6 text-center">
                        Aún no hay usuarios registrados.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {recentUsers.map((u) => (
                          <div key={u.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container border border-transparent hover:border-outline-variant transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 bg-linear-to-br from-surface-container-high to-outline-variant rounded-full flex items-center justify-center font-bold text-on-surface-variant text-sm shrink-0">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-on-surface truncate">{u.name}</p>
                                <p className="text-xs text-on-surface-variant truncate">{u.email}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={cn(
                                "text-xs font-bold px-2 py-1 rounded-full",
                                u.role === "ADMIN" ? "bg-danger-container text-on-danger-container" :
                                u.role === "GUIDE" ? "bg-primary/10 text-primary" :
                                "bg-surface-container text-on-surface-variant"
                              )}>
                                {u.role}
                              </span>
                              <p className="text-[10px] text-on-surface-variant mt-1">
                                {dayjs(u.createdAt).format("D [de] MMMM [de] YYYY")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
