"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkle, ChatTeardropDots } from "@phosphor-icons/react";
import { ChatInterface } from "./ChatInterface";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(true);

    useEffect(() => {
        const handleOpenChat = () => {
            setIsOpen(true);
            setHasNewMessage(false);
        };
        window.addEventListener("open-chat", handleOpenChat);
        return () => window.removeEventListener("open-chat", handleOpenChat);
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setHasNewMessage(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.92 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="mb-4 w-[92vw] md:w-[400px] shadow-glow-primary rounded-2xl overflow-hidden bg-surface/80 backdrop-blur-2xl border border-surface/50"
                    >
                        <ChatInterface />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating button */}
            <div className="relative">
                {/* Pulse glow when closed */}
                {!isOpen && (
                    <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl animate-pulse pointer-events-none" />
                )}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-40" />
                )}

                {/* Badge */}
                <AnimatePresence>
                    {hasNewMessage && !isOpen && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 z-10 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        >
                            <span className="text-white text-[10px] font-bold">1</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleToggle}
                    id="chat-widget-toggle"
                    className="relative bg-linear-to-br from-primary to-secondary text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
                    title="Hablar con Kary"
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                <X size={24} />
                            </motion.div>
                        ) : (
                            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                <Sparkle size={22} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Tooltip when closed */}
            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.4 }}
                    className="absolute right-16 bottom-2 bg-volcano-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
                >
                    <span className="inline-flex items-center gap-1.5">
                        <ChatTeardropDots size={15} className="text-oro-indigena" />
                        Habla con Kary, tu guía IA
                    </span>
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-volcano-black border-y-4 border-y-transparent" />
                </motion.div>
            )}
        </div>
    );
}
