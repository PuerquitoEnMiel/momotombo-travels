---
name: Momotombo Travels Eco-Luxury
colors:
  primary: "#8a3824"
  on-primary: "#ffffff"
  primary-hover: "#6f2c1c"
  primary-container: "#8a3824"
  on-primary-container: "#ffb2a0"
  secondary: "#1e3b2f"
  on-secondary: "#ffffff"
  secondary-container: "#c6e7d6"
  on-secondary-container: "#4b695b"
  tertiary: "#c49a45"
  tertiary-text: "#7a5c17"
  on-tertiary: "#ffffff"
  volcano-black: "#181513"
  volcan-magma: "#ff4500"
  sunset-orange: "#ff7849"
  ocean-deep: "#00386e"
  nica-blue: "#004f96"
  colonial-cream: "#faf3e0"
  laguna-blue: "#4ba3c7"
  background: "#fff8f4"
  surface: "#ffffff"
  on-surface: "#1e1b18"
  on-surface-variant: "#55423e"
  text-muted: "#6f5b56"
  surface-container: "#faf2ed"
  outline: "#88726d"
  outline-variant: "#e8e2d5"
  error: "#c81e1e"
typography:
  display:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: 700
  headline:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: 600
  title:
    fontFamily: Newsreader
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
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  3xl: 24px
  pill: 9999px
---

# Momotombo Travels Design System

## Overview
Momotombo Travels is an AI-powered eco-luxury travel discovery and booking platform for Nicaragua.
Visual identity balances volcanic majesty, colonial elegance, and lush tropical biodiversity.
The interface feels premium, warm, authentic, and modern — never generic, sterile, or corporate.

## Color Palette
- **Primary (Terracota Volcánica)** (`#8a3824`): Primary buttons, active brand navigation, key interactive states. Hover: `#6f2c1c`.
- **Secondary (Selva Esmeralda)** (`#1e3b2f`): Eco-tourism badges, nature highlights, sustainability tags.
- **Tertiary (Oro Indígena)** (`#c49a45`): Premium ratings, VIP badges, golden accents on DARK surfaces. For text/icons on light surfaces use **Tertiary Text** (`#7a5c17`, WCAG AA).
- **Volcano Magma** (`#ff4500`): Adventure badges, urgent CTAs, volcanic tour markers.
- **Sunset Orange** (`#ff7849`): Secondary highlights, notifications, sunset cruise highlights.
- **Colonial Cream** (`#faf3e0`): Warm subtle card backdrops and pill containers.
- **Laguna Blue** (`#4ba3c7`): Water activities, lagoon excursions, lake tags.
- **Background** (`#fff8f4`): Warm travertine canvas in light mode (the single app canvas).
- **Volcano Black** (`#181513`): High-contrast dark sections, hero backdrops.
- **On-Surface** (`#1e1b18`): High contrast readable body text. Muted text: **Text Muted** (`#6f5b56`).

## Typography
- **Headings & Hero Displays**: Newsreader (Google Fonts) — elegant editorial serif.
- **Body, UI & Data**: Inter (Google Fonts) — clean, highly readable, structured.

## Component Patterns
- **Isotype & Brand Iconography**:
  - **Momotombo Volcano Glyph**: Iconic triangular conical silhouette (`viewBox="0 0 32 32"`), magma vent apex, and horizontal stylized ripple waves representing Lake Xolotlán (Lake Managua).
  - Used in Navbar header, hero watermarks, and brand badges. Never replace with generic plane/globe travel stock icons.
- **Buttons & Action Triggers**:
  - Primary: Terracota Volcánica background (`#8a3824`), white text, rounded-xl (12px) or pill (9999px), hover to `#6f2c1c` with subtle lift.
  - Magma Action (High-Energy CTA): Linear gradient `from-volcan-magma to-sunset-orange` (`#ff4500` to `#ff7849`) paired with `shadow-glow-magma-intense` (`0 10px 25px -5px rgba(255, 69, 0, 0.45)`). Used for key conversion moments (e.g. "Comenzar Viaje", "Reservar Expedición").
  - Secondary: Selva Esmeralda (`#1e3b2f`) for eco-tourism and nature-first actions.
  - Ghost / Outline: 1px border with `color-primary` or white/20 on dark volcanic backgrounds.
- **Cards & Geographic Tiles**:
  - 16px to 24px border-radius (`rounded-2xl` / `rounded-3xl`).
  - Container styling: White background with warm border (`border-stone-100` / `border-outline-variant/30`), soft ambient elevation (`shadow-md` transitioning to `shadow-xl` on hover).
  - Image header: Aspect ratio 16:9 or 4:3 with gradient darkening vignette (`from-black/70 via-black/20 to-transparent`) for overlay contrast.
  - **Geographic Card Anatomy**:
    - Top badges: Category pill (`Selva Esmeralda` or `Volcán Magma`) + UNESCO / Biosphere recognition.
    - Title: Bold Newsreader typography with destination name.
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
- **DO** combine volcano warm tones (`#ff4500`) with tropical greens (`#1e3b2f`) and terracotta (`#8a3824`) in balanced harmony.
- **DO** incorporate authentic local geographical indicators: altitude in `msnm`, lake proximity, and dry/rainy seasons.
- **DO** use the authentic Momotombo Volcano + Lake Xolotlán silhouette isotype across high-impact surfaces.
- **DO** use rounded cards and glassmorphism with generous whitespace.
- **DO** feature authentic imagery of Nicaraguan volcanoes, colonial architecture (Granada/León), and Pacific beaches.
- **DON'T** use generic corporate blues, purple SaaS gradients, or cold gray tech palettes.
- **DON'T** use generic travel icons (airplanes, generic suitcase clips) when Nicaraguan natural motifs apply.
- **DON'T** use harsh square sharp corners (maintain minimum 8px to 16px border radius).
