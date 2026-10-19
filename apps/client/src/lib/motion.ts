/**
 * Shared motion constants. Keep every transition on one curve/timing family
 * instead of inlining ad-hoc beziers and durations per component.
 */

/** Signature easing (matches the `ease-out-expo` CSS utility) */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.23, 1, 0.32, 1];

/** Standard transition durations in seconds (framer-motion uses seconds) */
export const DUR = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const;

/** Standard fade/rise entrance for scroll sections */
export const fadeRise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: DUR.slower, ease: EASE_OUT_EXPO },
} as const;
