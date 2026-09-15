"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Calendar, CurrencyDollar, Pulse, Gear, CheckCircle, Clock } from "@phosphor-icons/react";
import { API_URL } from "@/lib/api";

interface GuideUser {
    name: string;
    email: string;
    role: string;
}

export default function ProveedoresDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<GuideUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("activities");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data) router.push("/auth/login");
                else if (data.role !== "GUIDE" && data.role !== "ADMIN") router.push("/perfil"); // Solo guías o admins
                else {
                    setUser(data);
                    setLoading(false);
                }
            })
            .catch(() => router.push("/auth/login"));
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
        );
    }

    const mockActivities = [
        { id: 1, name: "Tour Guiado Volcán Masaya", status: "Active", bookings: 12, revenue: 360 },
        { id: 2, name: "Clases de Surf San Juan del Sur", status: "Active", bookings: 8, revenue: 240 },
        { id: 3, name: "Recorrido Histórico León", status: "Draft", bookings: 0, revenue: 0 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-20">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-volcano-black text-white p-6 flex flex-col min-h-[calc(100vh-80px)]">
                <div className="mb-10">
                    <h2 className="text-xl font-bold font-serif mb-1">Portal Guías</h2>
                    <p className="text-xs text-gray-400">Momotombo Travels</p>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { id: "activities", label: "Mis Actividades", icon: Pulse },
                        { id: "calendar", label: "Calendario", icon: Calendar },
                        { id: "finance", label: "Cobros y Finanzas", icon: CurrencyDollar },
                        { id: "settings", label: "Configuración", icon: Gear },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            id={`btn-prov-nav-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] text-left ${
                                activeTab === tab.id ? "bg-primary text-white" : "text-gray-400 hover:bg-white/5"
                            }`}
                        >
                            <tab.icon size={18} />
                            <span className="font-medium text-sm">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/10 mt-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-sm">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{user?.name}</p>
                            <p className="text-xs text-oro-indigena">Guía Verificado</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10">
                {activeTab === "activities" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Mis Actividades</h1>
                                <p className="text-gray-500">Gestiona los tours y experiencias que ofreces.</p>
                            </div>
                            <Link
                                href="/proveedores/actividades/nueva"
                                id="btn-prov-new-activity"
                                className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                            >
                                <PlusCircle size={18} /> Nueva Actividad
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Actividad</th>
                                        <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Reservas</th>
                                        <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Ingresos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {mockActivities.map(act => (
                                        <tr key={act.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">{act.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {act.status === "Active" ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-secondary px-2.5 py-1 rounded-full text-xs font-bold border border-green-100">
                                                        <CheckCircle size={12} /> Activo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-oro-indigena px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-100">
                                                        <Clock size={12} /> Borrador
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">{act.bookings}</td>
                                            <td className="px-6 py-4 font-bold text-primary">${act.revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === "calendar" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Calendario</h1>
                        <p className="text-gray-500 mb-8">Administra tu disponibilidad y horarios de tours.</p>
                        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="font-bold text-xl text-gray-900 mb-2">Calendario de Reservas</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Sincroniza tus reservas con tu calendario personal de Google o Apple.</p>
                        </div>
                    </motion.div>
                )}
                
                {activeTab === "finance" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Finanzas</h1>
                        <p className="text-gray-500 mb-8">Revisa tus ganancias y métodos de retiro (Stripe Connect).</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-linear-to-br from-primary to-primary-container rounded-2xl p-6 text-white shadow-lg">
                                <p className="text-white/80 font-medium mb-1">Balance Disponible</p>
                                <h3 className="text-4xl font-bold">$600.00</h3>
                                <button className="mt-4 bg-white text-primary text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-50 w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">Retirar a Banco</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
