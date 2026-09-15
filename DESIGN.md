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
- **Isotype & Brand Iconography**:
  - **Momotombo Volcano Glyph**: Iconic triangular conical silhouette (`viewBox="0 0 32 32"`), magma vent apex, and horizontal stylized ripple waves representing Lake Xolotlán (Lake Managua).
  - Used in Navbar header, hero watermarks, and brand badges. Never replace with generic plane/globe travel stock icons.
- **Buttons & Action Triggers**:
  - Primary: Nica Blue background (`#004f96`), white text, rounded-xl (12px) or pill (9999px), subtle hover lift.
  - Magma Action (High-Energy CTA): Linear gradient `from-volcan-magma to-sunset-orange` (`#ff4500` to `#ff7849`) paired with `shadow-glow-magma-intense` (`0 10px 25px -5px rgba(255, 69, 0, 0.45)`). Used for key conversion moments (e.g. "Comenzar Viaje", "Reservar Expedición").
  - Secondary: Selva Esmeralda (`#006e2a`) for eco-tourism and nature-first actions.
  - Ghost / Outline: 1px border with `color-primary` or white/20 on dark volcanic backgrounds.
- **Cards & Geographic Tiles**:
  - 16px to 24px border-radius (`rounded-2xl` / `rounded-3xl`).
  - Container styling: White background with warm border (`border-stone-100` / `border-outline-variant/30`), soft ambient elevation (`shadow-md` transitioning to `shadow-xl` on hover).
  - Image header: Aspect ratio 16:9 or 4:3 with gradient darkening vignette (`from-black/70 via-black/20 to-transparent`) for overlay contrast.
  - **Geographic Card Anatomy**:
    - Top badges: Category pill (`Selva Esmeralda` or `Volcán Magma`) + UNESCO / Biosphere recognition.
    - Title: Bold Outfit typography with destination name.
    - Altitude badge: Metric elevation (`msnm` - metros sobre el nivel del mar) giving true volcanic/mountain terrain context.
    - Seasonality badge: Micro-pill highlighting best travel period (`Nov - May: Seca` or `Jun - Oct: Verde`).
    - Region & Location: Map pin with department/region (e.g. "León / La Paz Centro").
    - Pricing / CTA: Currency in USD with clear per-person rating and interactive booking trigger.
- **Atmospheric Elements**:
  - **Volcano Coordinates**: Latitude/Longitude metadata stamp (`12°29'N 86°32'W`) anchoring digital travelers to the real Momotombo summit.
  - **Ambient Glows**: Radial magma blurs (`bg-volcan-magma/15 blur-3xl`) creating warmth behind dark hero banners.
- **Navigation**:
  - Sticky glassmorphism bar (`backdrop-blur-md`, semi-transparent background).
  - Clear brand logo with volcano glyph + direct route shortcuts (Ruta Volcánica, Explorar, Planificar con IA).

## Do's and Don'ts
- **DO** combine volcano warm tones (`#ff4500`) with tropical greens (`#006e2a`) and deep blues (`#004f96`) in balanced harmony.
- **DO** incorporate authentic local geographical indicators: altitude in `msnm`, lake proximity, and dry/rainy seasons.
- **DO** use the authentic Momotombo Volcano + Lake Xolotlán silhouette isotype across high-impact surfaces.
- **DO** use rounded cards and glassmorphism with generous whitespace.
- **DO** feature authentic imagery of Nicaraguan volcanoes, colonial architecture (Granada/León), and Pacific beaches.
- **DON'T** use generic corporate blues, purple SaaS gradients, or cold gray tech palettes.
- **DON'T** use generic travel icons (airplanes, generic suitcase clips) when Nicaraguan natural motifs apply.
- **DON'T** use harsh square sharp corners (maintain minimum 8px to 16px border radius).
