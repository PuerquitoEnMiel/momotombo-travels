# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation for the single-root-lockfile workflow (AGENTS.md, README, SETUP, app READMEs)
- `check-models` npm script in `apps/server`

### Changed
- Dependency installs are root-only; one root `package-lock.json` is the single source of truth (per-app lockfiles removed)
- `deploy.ps1` now mirrors the GitHub Actions deploy pipeline (same Cloud Run services, secrets, and migrate job)
- `iniciar.bat` delegates to `start.ps1` as the single canonical startup path
- lint-staged now lints/prettifies only staged files per workspace

### Fixed
- Rate-limit documentation corrected (ThrottlerModule default is 20 req/min, configurable via `THROTTLE_TTL_MS` / `THROTTLE_LIMIT`)
- Removed incorrect "TypeScript strict mode" claim for the server (only the client is `strict: true`)
- Deploy pipeline fixes (Cloud Run services `momotombo-client` / `momotombo-server`, secrets via Secret Manager, `momotombo-migrate` job running `prisma migrate deploy`)
- `check-models` script no longer prints API key material to the console (masked to last 4 characters)

### Security
- Security fixes from the audit remediation
- Schema migration backfill (`20261018000001_audit_backfill`) — Prisma migrations now cover the full schema; `prisma migrate deploy` works on a fresh database (dev DBs created with `prisma db push` must be reset with `npx prisma migrate reset`)

### Design & SEO
- Per-route SEO metadata via route-segment layouts (`generateMetadata` for `explorar/[slug]` / `blog/[slug]`), self-referencing canonicals, `noindex` on all private routes (perfil, checkout, bookings, planificar, itinerarios, proveedores, admin, auth)
- Structured data (JSON-LD): TravelAgency + WebSite + FAQPage on home, TouristAttraction on destination pages, BlogPosting on articles
- Raster `opengraph-image.png` (1200×630) + PNG `apple-icon` (social platforms ignore SVG OG images); brand icons regenerated from the Gran Fusión palette
- Sitemap: only indexable public routes, real `lastmod` from entity `updatedAt`; robots `Disallow` covers all private areas
- Design system: broken dark-mode hybrid removed (single light theme), WCAG-safe text tokens (`text-tertiary-text`, `text-text-muted`), unified canvas `#fff8f4`, Tailwind-default radius scale (cards 16–24px per DESIGN.md), shared money formatter (`lib/money.ts`) and motion constants (`lib/motion.ts`)
- DESIGN.md palette/typography aligned with the shipped Gran Fusión system (Newsreader display + Inter UI)
- Performance: lazy chat widget + toaster (`next/dynamic`), parallel auth fetches, `optimizePackageImports` for Phosphor/framer-motion, AVIF/WebP image pipeline

## [1.0.0] - 2026-06-28

### Added
- Initial project setup with Next.js 16 and NestJS 11
- Complete design system with Tailwind v4
- i18n support (Spanish/English)
- Authentication with JWT and Google OAuth
- Role-based access control (ADMIN, GUIDE, TRAVELER)
- Destination management with categories
- Itinerary planning with AI (Gemini)
- Booking system with Stripe integration
- Review and rating system
- Blog system with comments and tags
- Coupon and promotion system
- Admin dashboard with moderation
- Global search functionality
- Health checks and monitoring
- Structured logging with Pino
- Prometheus metrics
- Sentry error tracking
- CI/CD with GitHub Actions
- E2E testing with Playwright
- Unit testing with Vitest and Jest

### Phase 1: Foundation
- Design system with 15+ UI primitives
- i18n with 11 namespaces
- Service layer with 8 services
- Custom hooks (useAuth, useApi, useToast, etc.)
- Type system with shared types
- Bug fixes and token corrections

### Phase 2: Pages & SEO
- Loading, error, and 404 states
- Blog post detail page
- Terms, privacy, and about pages
- Password recovery flow
- OpenGraph and Twitter cards
- PWA manifest and icons
- Sitemap and robots.txt
- Accessibility improvements

### Phase 3: Security & Backend
- Helmet, compression, CORS
- ValidationPipe global
- RolesGuard and decorators
- Refresh token rotation
- Password reset and email verification
- Real Google OAuth
- Enhanced Stripe with refunds
- Upload with validation
- Health checks with Terminus

### Phase 4: Database & Features
- 10 new Prisma models
- Comments system with threading
- Tags and categories
- Itinerary sharing and forking
- Review moderation
- Coupons and promotions
- Admin endpoints
- Global search
- Soft delete on models

### Phase 5: DevOps & Quality
- GitHub Actions CI/CD
- Husky + lint-staged + commitlint
- Sentry error tracking
- Pino structured logging
- Prometheus metrics
- Vitest + Testing Library
- Playwright E2E tests
- Bundle analyzer
- Documentation (LICENSE, CHANGELOG, ARCHITECTURE)
