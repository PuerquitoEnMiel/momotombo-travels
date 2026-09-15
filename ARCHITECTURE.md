# Architecture

## Overview

Momotombo Travels is a monorepo with two main applications:
- **Client**: Next.js 16 + React 19 + Tailwind v4 + TypeScript
- **Server**: NestJS 11 + Prisma 7 + PostgreSQL + Gemini AI + Pinecone + Stripe

## Monorepo Structure

```
momotombo-travels/
├── apps/
│   ├── client/          # Next.js frontend
│   └── server/          # NestJS backend
├── .github/workflows/   # CI/CD pipelines
├── .husky/              # Git hooks
├── package.json         # Root workspace config
└── AGENTS.md           # AI assistant guidelines
```

## Client Architecture

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind v4
- **State**: React hooks + Context
- **i18n**: react-i18next
- **Testing**: Vitest + Testing Library + Playwright
- **Error Tracking**: Sentry
- **Analytics**: (placeholder for future)

### Directory Structure
```
apps/client/src/
├── app/                    # Next.js routes
│   ├── (auth)/            # Auth routes (login, register, etc.)
│   ├── (public)/          # Public routes (home, explore, blog)
│   ├── (protected)/       # Protected routes (profile, itineraries)
│   └── (admin)/           # Admin routes
├── components/
│   ├── ui/                # Reusable UI primitives
│   ├── features/          # Feature-specific components
│   └── layout/            # Layout components (Navbar, Footer)
├── hooks/                 # Custom React hooks
├── services/              # API service layer
├── types/                 # TypeScript types
└── lib/                   # Utilities (cn, i18n, api)
```

### Key Patterns

#### UI Primitives
All UI components are in `components/ui/` and follow a consistent API:
- `Button` - variants: primary, secondary, ghost, outline, destructive, glass
- `Input` - with label, error, helper text
- `Card` - with header, body, footer
- `Modal` - with focus trap, escape key, portal
- `Spinner`, `Skeleton`, `EmptyState`, `ErrorState`
- `Avatar`, `Badge`, `Tag`
- `Container`, `Section`

#### Service Layer
All API calls go through `services/`:
```typescript
// services/destinations.service.ts
export const destinationsService = {
  list: (category?: string) => api.get<Destination[]>(`/destinations?category=${category}`),
  getBySlug: (slug: string) => api.get<Destination>(`/destinations/${slug}`),
  aiSearch: (query: string) => api.get<AiSearchResponse>(`/gemini-agent/ai-search?q=${query}`),
};
```

#### Hooks
Custom hooks in `hooks/`:
- `useAuth()` - authentication state and methods
- `useApi()` - generic API call wrapper
- `useToast()` - toast notifications
- `useDebounce()`, `useLocalStorage()`, `useOnClickOutside()`, etc.

#### i18n
Translations in `public/locales/` with 11 namespaces:
- common, nav, auth, home, explore, itinerary, profile, admin, blog, errors, validation

## Server Architecture

### Technology Stack
- **Framework**: NestJS 11
- **Database**: PostgreSQL + Prisma 7
- **Auth**: JWT + Passport + Google OAuth
- **AI**: Google Gemini + Pinecone (vector search)
- **Payments**: Stripe
- **Logging**: Pino (structured)
- **Metrics**: Prometheus
- **Error Tracking**: Sentry
- **Testing**: Jest + Supertest

### Directory Structure
```
apps/server/src/
├── common/                # Shared utilities
│   ├── decorators/        # @Public, @Roles, @CurrentUser
│   ├── guards/            # JwtAuthGuard, RolesGuard
│   ├── filters/           # AllExceptionsFilter
│   └── pipes/             # ValidationPipe
├── config/                # Configuration
│   └── env.validation.ts  # Joi schema for env vars
├── infrastructure/        # External services
│   ├── prisma/            # Database client
│   ├── stripe/            # Payment processing
│   ├── gemini-agent/      # AI agent
│   ├── pinecone/          # Vector search
│   ├── logging/           # Pino logger
│   └── metrics/           # Prometheus metrics
├── modules/               # Domain modules
│   ├── auth/              # Authentication
│   ├── users/             # User management
│   ├── destinations/      # Destinations CRUD
│   ├── itineraries/       # Itinerary planning
│   ├── bookings/          # Booking management
│   ├── reviews/           # Reviews & ratings
│   ├── blogs/             # Blog posts
│   ├── comments/          # Comments
│   ├── tags/              # Tags
│   ├── categories/        # Categories
│   ├── coupons/           # Coupons & promotions
│   ├── search/            # Global search
│   ├── admin/             # Admin operations
│   ├── audit/             # Audit logging
│   └── gamification/      # Points & badges
└── health/                # Health checks
```

### Key Patterns

#### Guards & Decorators
```typescript
// Public endpoint (no auth required)
@Public()
@Get('destinations')
listDestinations() { ... }

// Authenticated endpoint
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: AuthenticatedUser) { ... }

// Role-based access
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Delete('users/:id')
deleteUser(@Param('id') id: string) { ... }
```

#### Service Pattern
Each module has:
- `*.module.ts` - Module definition
- `*.controller.ts` - HTTP endpoints
- `*.service.ts` - Business logic
- `*.dto.ts` - Data transfer objects with validation
- `*.spec.ts` - Unit tests

#### Database
Prisma schema in `prisma/schema.prisma`:
- 20+ models with relationships
- Soft delete pattern (`deletedAt` field)
- Audit fields (`createdAt`, `updatedAt`)
- Indexes for performance

### Security

#### Authentication
- JWT tokens with refresh token rotation
- Google OAuth 2.0
- Password hashing with bcrypt (12 rounds)
- Token storage in httpOnly cookies (client)

#### Authorization
- Role-based access control (RBAC)
- Global JwtAuthGuard
- RolesGuard for role checks
- @Public() decorator for public endpoints

#### Input Validation
- class-validator DTOs
- Global ValidationPipe with whitelist
- CORS whitelist
- Helmet security headers
- Rate limiting (ThrottlerModule)

### Monitoring & Observability

#### Logging
- Pino structured logging
- Request ID tracking
- Sensitive data redaction
- Different log levels per environment

#### Metrics
- Prometheus metrics at `/metrics`
- HTTP request counts and durations
- Active users gauge
- Booking and payment counters

#### Error Tracking
- Sentry integration
- Client and server error capture
- Performance monitoring
- Session replay (client)

## Deployment

### CI/CD Pipeline
GitHub Actions workflows:
1. **CI** (on push/PR): lint, test, build
2. **Deploy** (on main): build Docker images, deploy to Cloud Run

### Infrastructure
- **Client**: Cloud Run (us-central1)
- **Server**: Cloud Run (us-central1)
- **Database**: Cloud SQL PostgreSQL
- **Storage**: Google Cloud Storage (for uploads)
- **CDN**: Cloudflare (planned)

### Environment Variables
See `.env.example` in each app for required variables.

## Testing Strategy

### Unit Tests
- **Client**: Vitest + Testing Library
- **Server**: Jest + Supertest
- Coverage target: 80%

### E2E Tests
- **Playwright** for critical user flows
- Runs in CI on PRs
- Covers: auth, explore, booking, admin

### Manual Testing
- Staging environment for QA
- Feature flags for gradual rollout

## Performance

### Client
- Next.js automatic code splitting
- Image optimization with next/image
- Bundle analyzer for monitoring
- Lazy loading for heavy components

### Server
- Database query optimization with indexes
- Caching layer (Redis - planned)
- Connection pooling
- Pagination for large datasets

## Future Improvements

### Short Term
- [ ] Redis caching layer
- [ ] Email service integration
- [ ] Push notifications
- [ ] Advanced search with filters
- [ ] User preferences and personalization

### Medium Term
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (expand i18n)
- [ ] AI-powered recommendations

### Long Term
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Machine learning for personalization
- [ ] Blockchain for booking verification
- [ ] AR/VR destination previews
