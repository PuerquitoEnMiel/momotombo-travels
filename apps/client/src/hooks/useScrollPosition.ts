"use client";

import { useEffect, useState } from "react";

interface ScrollState {
  y: number;
  isScrolled: boolean;
  direction: "up" | "down" | "idle";
}

export function useScrollPosition(threshold = 50): ScrollState {
  const [state, setState] = useState<ScrollState>({ y: 0, isScrolled: false, direction: "idle" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setState({
        y,
        isScrolled: y > threshold,
        direction: y > lastY ? "down" : y < lastY ? "up" : "idle",
      });
      lastY = y;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return state;
}
