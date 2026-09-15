"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkle, CheckCircle, ArrowRight } from "@phosphor-icons/react";

export function AtelierPlanner() {
    const router = useRouter();
    const [focus, setFocus] = useState("Ascenso a Volcanes Activos & Geología");
    const [duration, setDuration] = useState("4 a 6 Días (Expedición Concentrada)");
    const [lodge, setLodge] = useState("mansiones");
    const [email, setEmail] = useState("");

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        const prompt = `Hola Kary, quiero diseñar una expedición en Nicaragua. Enfoque: ${focus}. Duración: ${duration}. Estilo de hospedaje: ${lodge === "mansiones" ? "Mansiones Coloniales" : "Eco-Lodges de Selva"}.${email ? ` Mi correo es ${email}.` : ""}`;
        if (typeof window !== "undefined") {
            localStorage.setItem("initial-query", prompt);
        }
        router.push("/planificar");
    };

    return (
        <section className="py-24 bg-surface relative" id="ia-planner">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden">
                    {/* Atelier Header */}
                    <div className="bg-primary text-on-primary px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <Sparkle size={22} weight="fill" className="text-oro-indigena" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold tracking-tight">Atelier Digital Momotombo</h3>
                                <p className="font-sans text-xs text-on-primary-container opacity-90">Generador de Itinerarios Vulcanológicos & Coloniales</p>
                            </div>
                        </div>
                        <span className="text-xs px-3.5 py-1 rounded-full bg-white/15 text-white font-mono font-medium tracking-wide">
                            IA Kary v4.2 Conectada
                        </span>
                    </div>

                    {/* Interactive Form */}
                    <form onSubmit={handleGenerate} className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block font-sans font-semibold text-xs text-on-surface uppercase tracking-wider mb-2.5">
                                    ¿Cuál es tu enfoque de viaje?
                                </label>
                                <select 
                                    value={focus}
                                    onChange={(e) => setFocus(e.target.value)}
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface font-sans text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                                >
                                    <option>Ascenso a Volcanes Activos & Geología</option>
                                    <option>Historia Colonial, Alta Gastronomía & Patios</option>
                                    <option>Relajación en Eco-Lodges & Sanación Termal</option>
                                    <option>Travesía Completa: Volcanes, Lagos & Océano Pacífico</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-xs text-on-surface uppercase tracking-wider mb-2.5">
                                    Duración estimada
                                </label>
                                <select 
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface font-sans text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                                >
                                    <option>4 a 6 Días (Expedición Concentrada)</option>
                                    <option>7 a 10 Días (Inmersión Integral)</option>
                                    <option>12+ Días (Gran Circuito Maribios & Costa)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-xs text-on-surface uppercase tracking-wider mb-2.5">
                                    Estilo de Hospedaje
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label 
                                        onClick={() => setLodge("mansiones")}
                                        className={`flex items-center gap-2.5 p-3 border rounded-lg cursor-pointer transition-all ${
                                            lodge === "mansiones" 
                                                ? "border-primary bg-primary/5 text-primary font-semibold" 
                                                : "border-outline-variant text-on-surface hover:bg-surface-container-low"
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="lodge" 
                                            checked={lodge === "mansiones"} 
                                            onChange={() => setLodge("mansiones")}
                                            className="text-primary focus:ring-primary accent-primary" 
                                        />
                                        <span className="text-xs">Mansiones Coloniales</span>
                                    </label>
                                    <label 
                                        onClick={() => setLodge("ecolodges")}
                                        className={`flex items-center gap-2.5 p-3 border rounded-lg cursor-pointer transition-all ${
                                            lodge === "ecolodges" 
                                                ? "border-primary bg-primary/5 text-primary font-semibold" 
                                                : "border-outline-variant text-on-surface hover:bg-surface-container-low"
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="lodge" 
                                            checked={lodge === "ecolodges"} 
                                            onChange={() => setLodge("ecolodges")}
                                            className="text-primary focus:ring-primary accent-primary" 
                                        />
                                        <span className="text-xs">Eco-Lodges de Selva</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block font-sans font-semibold text-xs text-on-surface uppercase tracking-wider mb-2.5">
                                    Tu Correo para recibir el Dossier
                                </label>
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="viajero@explorador.com"
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-on-surface font-sans text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Action row */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-outline-variant/40">
                            <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                                <CheckCircle size={16} weight="fill" className="text-secondary shrink-0" />
                                <span>Sin compromiso de reserva inmediata. Propuesta en <strong className="text-on-surface">menos de 2 horas</strong>.</span>
                            </div>

                            <button
                                type="submit"
                                id="atelier-generate-submit"
                                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-primary hover:bg-primary-hover text-on-primary font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 shadow-md cursor-pointer"
                            >
                                <span>Generar Propuesta Personalizada</span>
                                <ArrowRight size={14} weight="bold" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
