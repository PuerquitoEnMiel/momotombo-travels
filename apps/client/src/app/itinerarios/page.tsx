"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapTrifold, Plus, ArrowRight, Clock, CheckCircle } from "@phosphor-icons/react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { API_URL } from "@/lib/api";

dayjs.locale("es");

interface Itinerary {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: string;
    days: any[];
}

export default function ItinerariesDashboard() {
    const router = useRouter();
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        fetch(`${API_URL}/itineraries`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.ok ? r.json() : [])
            .then((data) => {
                setItineraries(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Mis Itinerarios</h1>
                        <p className="text-gray-500">Planifica, edita y revisa tus próximas aventuras.</p>
                    </div>
                    <Link
                        href="/planificar"
                        id="btn-create-itinerary-top"
                        className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-full font-bold transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-md flex items-center justify-center gap-2 active:scale-[0.97]"
                    >
                        <Plus size={18} />
                        Crear nuevo con Kary IA
                    </Link>
                </div>

                {itineraries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm"
                    >
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapTrifold size={32} />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Aún no tienes itinerarios</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Deja que Kary, nuestra IA, te ayude a armar el viaje perfecto por Nicaragua en segundos.
                        </p>
                        <Link
                            href="/planificar"
                            id="btn-create-itinerary-empty"
                            className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] inline-block"
                        >
                            Comenzar a planificar
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itineraries.map((it) => (
                            <motion.div
                                key={it.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden flex flex-col group active:scale-[0.99]"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                            ${it.status === 'DRAFT' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}
                                        >
                                            {it.status === 'DRAFT' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                            {it.status === 'DRAFT' ? 'Borrador' : 'Confirmado'}
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">
                                        {it.title}
                                    </h3>
                                    <div className="space-y-2 mt-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span>
                                                {dayjs(it.startDate).format("DD MMM YYYY")} - {dayjs(it.endDate).format("DD MMM YYYY")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapTrifold size={16} className="text-gray-400" />
                                            <span>{it.days.length} días planificados</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center group-hover:bg-primary/5 transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">
                                    <span className="text-xs font-medium text-gray-500">Actualizado hace poco</span>
                                    <Link
                                        href={`/planificar/${it.id}`}
                                        id={`link-itinerary-details-${it.id}`}
                                        className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                                    >
                                        Ver detalles <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
