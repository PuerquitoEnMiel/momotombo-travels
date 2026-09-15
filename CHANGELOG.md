# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

## [1.0.0] - 2026-06-28

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
