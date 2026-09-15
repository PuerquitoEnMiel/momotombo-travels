"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/cn";

const SLIDE_KEYS = ["planning", "discover", "stress-free"] as const;
type SlideKey = (typeof SLIDE_KEYS)[number];

const SLIDE_IMAGES: Record<SlideKey, string> = {
  planning: "https://images.unsplash.com/photo-1596423736287-192f592f694d?q=80&w=2070&auto=format&fit=crop",
  discover: "https://images.unsplash.com/photo-1534777367038-9404f45b869a?q=80&w=2070&auto=format&fit=crop",
  "stress-free": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
};

export function AuthCarousel() {
  const { t } = useTranslation("auth");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDE_KEYS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentKey = SLIDE_KEYS[currentIndex];

  return (
    <div
      className="relative w-full h-full bg-volcano-black overflow-hidden lg:rounded-r-[40px] shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Momotombo highlights"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentKey}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={SLIDE_IMAGES[currentKey]}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 leading-tight text-balance drop-shadow-lg">
              {t(`carousel.${currentKey}.title`)}
            </h2>
            <p className="text-lg text-gray-200 opacity-90 leading-relaxed text-pretty drop-shadow-md">
              {t(`carousel.${currentKey}.description`)}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-8" role="tablist" aria-label="Slide controls">
          {SLIDE_KEYS.map((key, idx) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
                idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
