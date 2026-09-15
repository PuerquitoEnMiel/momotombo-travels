---
name: Momotombo Travels Eco-Luxury
colors:
  primary: "#004f96"
  on-primary: "#ffffff"
  primary-container: "#0067c0"
  on-primary-container: "#dbe7ff"
  secondary: "#006e2a"
  on-secondary: "#ffffff"
  secondary-container: "#86fb96"
  on-secondary-container: "#00752d"
  tertiary: "#c9a900"
  volcano-black: "#121212"
  volcan-magma: "#ff4500"
  sunset-orange: "#ff7849"
  ocean-deep: "#003a6e"
  colonial-cream: "#faf3e0"
  laguna-blue: "#4ba3c7"
  surface: "#f9f9ff"
  on-surface: "#191c21"
  surface-container: "#ecedf6"
  outline: "#717783"
  outline-variant: "#c1c6d4"
  error: "#c81e1e"
typography:
  display:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: 700
  headline:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: 600
  title:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: 600
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
  label:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
  editorial:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: 400
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
---

# Momotombo Travels Design System

## Overview
Momotombo Travels is an AI-powered eco-luxury travel discovery and booking platform for Nicaragua.
Visual identity balances volcanic majesty, colonial elegance, and lush tropical biodiversity.
The interface feels premium, warm, authentic, and modern — never generic, sterile, or corporate.

## Color Palette
- **Primary (Nica Blue)** (`#004f96`): Primary buttons, active brand navigation, trust, key interactive states.
- **Secondary (Selva Esmeralda)** (`#006e2a`): Eco-tourism badges, nature highlights, sustainability tags.
- **Tertiary (Oro Indígena)** (`#c9a900`): Premium ratings, VIP badges, golden accents, curated badges.
- **Volcano Magma** (`#ff4500`): Adventure badges, urgent CTAs, volcanic tour markers.
- **Sunset Orange** (`#ff7849`): Secondary highlights, notifications, sunset cruise highlights.
- **Colonial Cream** (`#faf3e0`): Warm subtle card backdrops and pill containers.
- **Laguna Blue** (`#4ba3c7`): Water activities, lagoon excursions, lake tags.
- **Surface** (`#f9f9ff`): Crisp clean background in light mode.
- **Volcano Black** (`#121212`): Dark mode canvas, high-contrast dark sections, hero backdrops.
- **On-Surface** (`#191c21`): High contrast readable body text.

## Typography
- **Headings & Hero Displays**: Outfit (Google Fonts) — modern geometric sans with warm character.
- **Body, UI & Data**: Inter (Google Fonts) — clean, highly readable, structured.
- **Editorial & Quotes**: Newsreader (Google Fonts) — elegant serif for cultural narratives and testimonials.

## Component Patterns
- **Buttons**:
  - Primary: Nica Blue background (`#004f96`), white text, rounded-md (12px) or pill (9999px), subtle hover lift.
  - Magma Action: Volcan Magma (`#ff4500`) for high-energy adventure booking.
  - Secondary: Selva Esmeralda (`#006e2a`) for eco-tourism actions.
  - Outline: 1px border with `color-primary`, transparent surface.
- **Cards**:
  - 16px border-radius (`rounded-lg` / `rounded-xl`).
  - Subtle border (`1px solid #c1c6d4`), soft elevation shadow (`shadow-md`).
  - Image header with aspect ratio 16:9 or 4:3, overlaid badge (e.g. "Eco-Trek", "Colonial").
- **Navigation**:
  - Sticky glassmorphism bar (`backdrop-blur-md`, semi-transparent background).
  - Clear brand logo with volcano glyph.

## Do's and Don'ts
- **DO** combine volcano warm tones (`#ff4500`) with tropical greens (`#006e2a`) and deep blues (`#004f96`) in balanced harmony.
- **DO** use rounded cards and glassmorphism with generous whitespace.
- **DO** feature authentic imagery of Nicaraguan volcanoes, colonial architecture (Granada/León), and Pacific beaches.
- **DON'T** use generic corporate blues, purple SaaS gradients, or cold gray tech palettes.
- **DON'T** use harsh square sharp corners (maintain minimum 8px to 16px border radius).
