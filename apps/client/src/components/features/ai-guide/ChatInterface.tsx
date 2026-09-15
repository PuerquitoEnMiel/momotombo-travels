"use client";

import { useState, useRef, useEffect } from "react";
import { PaperPlaneRight, Sparkle, MapPin, Star, ArrowRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/lib/api";
import { formatAndSanitize, sanitizeHtml } from "@/lib/sanitize";

interface SuggestedDestination {
    name: string;
    slug: string;
    imageUrl?: string;
    rating?: number;
    category?: string;
}

interface Message {
    role: "user" | "assistant";
    content: string;
    suggestions?: SuggestedDestination[];
    action_type?: string;
}

const QUICK_SUGGESTIONS = [
    "¿Qué hacer en Ometepe?",
    "Mejores playas de Nicaragua",
    "Aventura en volcanes",
    "Destinos coloniales",
];

function TypingIndicator() {
    return (
        <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-nica-blue to-selva-esmeralda flex items-center justify-center text-white text-xs font-bold shrink-0">
                K
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
        </div>
    );
}

function DestinationCard({ dest }: { dest: SuggestedDestination }) {
    return (
        <Link href={`/explorar/${dest.slug}`}>
            <div className="group flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:border-nica-blue/30 hover:shadow-md transition-all">
                {dest.imageUrl && (
                    <Image
                        src={dest.imageUrl}
                        alt={dest.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate group-hover:text-nica-blue transition-colors">{dest.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        {dest.rating && (
                            <span className="flex items-center gap-0.5">
                                <Star size={10} className="text-oro-indigena fill-oro-indigena" />
                                {dest.rating}
                            </span>
                        )}
                        {dest.category && (
                            <span className="flex items-center gap-0.5">
                                <MapPin size={10} />
                                {dest.category}
                            </span>
                        )}
                    </div>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-nica-blue transition-colors shrink-0" />
            </div>
        </Link>
    );
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "¡Hola! Soy **Kary**, tu guía personal de Nicaragua.\n\n¿Qué aventura estás buscando hoy?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        const query = localStorage.getItem("initial-query");
        if (query) {
            localStorage.removeItem("initial-query");
            sendMessage(query);
        }
    }, []);

    const sendMessage = async (text?: string) => {
        const userMessage = text ?? input;
        if (!userMessage.trim() || isLoading) return;
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

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || "Error conectando con Kary");
            }

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
                {
                    role: "assistant",
                    content: "Lo siento, hubo un error al conectarme. ¿Deseas intentar nuevamente?",
                },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const formatContent = (text: string) => {
        return formatAndSanitize(text);
    };

    const showQuickSuggestions = messages.length === 1;

    return (
        <div className="flex flex-col h-[600px] w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="bg-linear-to-r from-volcano-black to-gray-800 px-5 py-4 flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-nica-blue to-selva-esmeralda flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        K
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-selva-esmeralda rounded-full border-2 border-gray-800" />
                </div>
                <div>
                    <h2 className="text-white font-bold text-sm">Kary</h2>
                    <p className="text-gray-400 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-selva-esmeralda rounded-full animate-pulse inline-block" />
                        Guía IA · En línea
                    </p>
                </div>
                <div className="ml-auto">
                    <Sparkle size={18} className="text-oro-indigena" />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gray-50/50">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-nica-blue to-selva-esmeralda flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1">
                                K
                            </div>
                        )}
                        <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                            <div
                                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === "user"
                                        ? "bg-nica-blue text-white rounded-br-none"
                                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
                                }`}
                                dangerouslySetInnerHTML={{ __html: msg.role === "assistant" ? formatContent(msg.content) : sanitizeHtml(msg.content) }}
                            />
                            {/* Destination cards */}
                            {msg.suggestions && msg.suggestions.length > 0 && (
                                <div className="w-full space-y-2 mt-1">
                                    {msg.suggestions.map((dest: SuggestedDestination, i: number) => (
                                        <DestinationCard key={i} dest={dest} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <TypingIndicator />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick suggestions */}
                <AnimatePresence>
                    {showQuickSuggestions && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-wrap gap-2 pt-2"
                        >
                            {QUICK_SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    className="text-xs bg-white border border-gray-200 text-gray-600 hover:border-nica-blue hover:text-nica-blue px-3 py-1.5 rounded-full transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 focus-within:border-nica-blue focus-within:ring-2 focus-within:ring-nica-blue/10 transition-all px-4 py-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Pregunta sobre un destino..."
                        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={isLoading || !input.trim()}
                        className="w-8 h-8 bg-nica-blue hover:bg-selva-esmeralda disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-full flex items-center justify-center transition-all shrink-0"
                    >
                        <PaperPlaneRight size={14} />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                    Respuestas generadas por IA · Siempre verifica la información
                </p>
            </div>
        </div>
    );
}
