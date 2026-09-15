"use client";

import { useState, useRef, useEffect } from "react";
import { PaperPlaneRight, Sparkle, MapPin, Star, Clock, CurrencyDollar, Calendar, ArrowRight, CaretRight, Compass, Mountains, TreePalm, Sun } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface Message {
    role: "user" | "assistant";
    content: string;
    suggestions?: any[];
    action_type?: string;
}

interface ItineraryDay {
    day: number;
    title: string;
    destinations: string[];
}

const STARTER_PROMPTS = [
    { icon: Mountains, label: "Aventura volcánica", prompt: "Quiero hacer una aventura de volcanes por 3 días" },
    { icon: TreePalm, label: "Playas y relax", prompt: "Busco playas paradisíacas para relajarme 5 días" },
    { icon: Compass, label: "Tour completo", prompt: "Planea un tour de 7 días por lo mejor de Nicaragua" },
    { icon: Sun, label: "Fin de semana", prompt: "Un fin de semana romántico en una ciudad colonial" },
];

function TypingDots() {
    return (
        <div className="flex items-center gap-1.5 px-4 py-3">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
    );
}

function SuggestionCard({ dest }: { dest: any }) {
    return (
        <Link href={`/explorar/${dest.slug || ""}`}>
            <div className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 hover:border-primary/40 hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99]">
                {dest.image_url && (
                    <img src={dest.image_url} alt={dest.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">{dest.name}</p>
                    <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{dest.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        {dest.price_level && (
                            <span className="flex items-center gap-0.5">
                                <CurrencyDollar size={10} />
                                {dest.price_level}
                            </span>
                        )}
                    </div>
                </div>
                <CaretRight size={14} className="text-gray-300 group-hover:text-primary shrink-0 transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </div>
        </Link>
    );
}

export default function PlanificarPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const sendMessage = async (text?: string) => {
        const userMessage = text ?? input;
        if (!userMessage.trim() || isLoading) return;

        if (!started) setStarted(true);
        setInput("");

        const newUserMsg: Message = { role: "user", content: userMessage };
        setMessages((prev) => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            const history = messages.map((m) => ({ role: m.role, content: m.content }));
            const response = await fetch(`${API_URL}/gemini-agent/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, history }),
            });

            if (!response.ok) throw new Error("Error conectando con Kary");

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.message,
                    suggestions: data.suggested_destinations,
                    action_type: data.action_type,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Lo siento, hubo un error de conexión. ¿Intentamos de nuevo? 🙏" },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const formatContent = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br />");
    };

    // Count destinations suggested across conversation
    const allSuggestions = messages
        .filter((m) => m.suggestions && m.suggestions.length > 0)
        .flatMap((m) => m.suggestions!);

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Full-screen experience */}
            <div className="flex h-screen">
                {/* Main chat area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 pt-20">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-lg font-bold shadow-md">
                                K
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                Kary
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Guía IA</span>
                            </h1>
                            <p className="text-xs text-gray-400">Planificadora de viajes inteligente · Especialista en Nicaragua</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
                            <Sparkle size={14} className="text-oro-indigena" />
                            <span>Powered by Gemini</span>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto">
                        {!started ? (
                            /* Landing state */
                            <div className="flex flex-col items-center justify-center h-full px-6 max-w-2xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] as const }}
                                    className="text-center mb-10"
                                >
                                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl shadow-primary/20">
                                        K
                                    </div>
                                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                        ¿A dónde te lleva la <span className="text-primary">aventura</span>?
                                    </h2>
                                    <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
                                        Soy Kary, tu guía IA. Cuéntame qué tipo de viaje sueñas y crearé un itinerario personalizado para vos.
                                    </p>
                                </motion.div>

                                {/* Starter prompts */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                    {STARTER_PROMPTS.map((s, i) => (
                                        <motion.button
                                            key={s.label}
                                            id={`prompt-starter-${i}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + i * 0.1, ease: [0.23, 1, 0.32, 1] as const }}
                                            onClick={() => sendMessage(s.prompt)}
                                            className="group flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-4 text-left hover:border-primary hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] shrink-0">
                                                <s.icon size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">{s.label}</p>
                                                <p className="text-gray-400 text-xs line-clamp-1">{s.prompt}</p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Chat messages */
                            <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] as const }}
                                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                    >
                                        {msg.role === "assistant" && (
                                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shrink-0 mt-1">
                                                K
                                            </div>
                                        )}
                                        <div className={`flex flex-col gap-3 ${msg.role === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                                            <div
                                                className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                                                    msg.role === "user"
                                                        ? "bg-primary text-white rounded-br-sm"
                                                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: msg.role === "assistant" ? formatContent(msg.content) : msg.content,
                                                }}
                                            />
                                            {/* Suggestions */}
                                            {msg.suggestions && msg.suggestions.length > 0 && (
                                                <div className="w-full space-y-2">
                                                    {msg.suggestions.map((dest: any, i: number) => (
                                                        <SuggestionCard key={i} dest={dest} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-3"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shrink-0">
                                            K
                                        </div>
                                        <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                                            <TypingDots />
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input area */}
                    <div className="bg-white border-t border-gray-100 px-6 py-5">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] px-5 py-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    id="input-plan-chat"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Describe tu viaje ideal... Ej: 5 días de aventura con volcanes y playas"
                                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    id="btn-plan-send"
                                    disabled={isLoading || !input.trim()}
                                    className="w-10 h-10 bg-primary hover:bg-secondary disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] shrink-0 shadow-sm active:scale-[0.97]"
                                >
                                    <PaperPlaneRight size={16} />
                                </button>
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-3">
                                Kary usa IA generativa · Los precios y datos son aproximados
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Itinerary summary */}
                {started && allSuggestions.length > 0 && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="hidden lg:flex w-80 border-l border-gray-100 bg-white flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 pt-20">
                            <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Calendar size={18} className="text-primary" />
                                Tu itinerario
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">{allSuggestions.length} destinos sugeridos</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {allSuggestions.map((dest: any, i: number) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{dest.name}</p>
                                        <p className="text-gray-400 text-xs line-clamp-2">{dest.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={() => window.dispatchEvent(new Event("open-chat"))}
                                id="btn-refine-itinerary"
                                className="w-full bg-linear-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-2 active:scale-[0.97]"
                            >
                                <Sparkle size={14} />
                                Refinar itinerario
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
