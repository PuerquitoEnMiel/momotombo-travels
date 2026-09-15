# AGENTS.md

## Repo layout

npm workspaces monorepo. Root `package.json` defines `workspaces: ["apps/*"]`. Each app has its own `package.json` and lockfile. Run `npm install` from the root to install all workspace dependencies.

```
apps/client  →  Next.js 16 + React 19 + Tailwind v4 + TypeScript
apps/server  →  NestJS 11 + Prisma 7 + PostgreSQL + Gemini AI + Pinecone + Stripe
```

### Client structure (`apps/client/src/`)
```
src/
├── app/                    # Next.js routes (admin, auth, blog, explorar, etc.)
├── components/
│   ├── ui/                 # Generic reusable components (Button, Card, etc.)
│   ├── features/           # Feature components (ai-guide, auth, maps, etc.)
│   └── layout/             # Navbar, Footer, Sidebar
├── hooks/                  # Custom React hooks
├── lib/                    # Utils, helpers, constants
├── services/               # API calls and client business logic
└── types/                  # Shared TypeScript types
```

### Server structure (`apps/server/src/`)
```
src/
├── common/                 # Guards, decorators, filters, interceptors, pipes
├── config/                 # External service configuration
├── infrastructure/         # Adapters: prisma, pinecone, stripe, gemini-agent
└── modules/                # Domain modules: auth, bookings, destinations, etc.
```

## Commands

### Root (from repo root)
| Task | Command |
|---|---|
| Dev server (client) | `npm run dev:client` |
| Dev server (server) | `npm run dev:server` |
| Build both | `npm run build` |
| Full startup (Docker) | `.\start.ps1` or `.\start.ps1 --seed` |

### Client (`apps/client`)
| Task | Command |
|---|---|
| Dev server (port 3000) | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |

### Server (`apps/server`)
| Task | Command |
|---|---|
| Dev server (port 3001) | `npm run start:dev` |
| Build | `npm run build` |
| Lint (auto-fix) | `npm run lint` |
| Format | `npm run format` |
| Unit tests | `npm run test` |
| Single test | `npx jest -t "test name pattern"` |
| E2E tests | `npm run test:e2e` |
| Prisma generate | `npx prisma generate` |
| DB migrate | `npx prisma migrate dev` |
| Seed | `npx prisma db seed` |

### Database
PostgreSQL on port 5432, database `momotombo_travels`. Two options:
- **Docker**: `docker-compose up -d` (user: `momotombo`, pass: `password123`)
- **Local PostgreSQL**: Update `DATABASE_URL` in `apps/server/.env` to match your credentials

After connecting, run `npx prisma migrate deploy` then `npx prisma db seed` from `apps/server`.

### Deploy
`.\deploy.ps1` — builds & deploys both apps to Google Cloud Run (region: `us-central1`). Dockerfiles use repo root as build context.

## Key conventions

- **Server module resolution**: `nodenext` (ESM). Imports need file extensions where required.
- **Client path alias**: `@/*` maps to `./src/*`.
- **Server has no path aliases** — use relative imports.
- **Prisma config**: uses `prisma.config.ts` (Prisma 6+ style), reads `DATABASE_URL` from `apps/server/.env`.
- **Next.js output**: `standalone` mode for Docker; do not change without updating Dockerfile.
- **Tailwind v4**: CSS-first config in `globals.css` via `@theme` (no `tailwind.config.ts`). Uses `@tailwindcss/postcss` plugin. Custom utilities defined with `@utility`.
- **Prettier**: single quotes, trailing commas (`.prettierrc` in server). ESLint enforces Prettier on server.
- **Server ESLint**: `@typescript-eslint/no-explicit-any` is **off**; `no-floating-promises` and `no-unsafe-argument` are **warn** only.
- **Rate limiting**: `ThrottlerModule` global guard, 10 req/min per IP.
- **CORS**: enabled globally (no origin restriction).
- **Fonts**: Inter, Outfit, Newsreader (Google Fonts via `next/font`).

## Architecture notes

- **AI**: `infrastructure/gemini-agent` wraps Google Gemini; `infrastructure/pinecone` handles vector embeddings for destination search.
- **Auth**: Passport with Google OAuth 20 + JWT. Roles: `TRAVELER`, `GUIDE`, `ADMIN`.
- **Prisma schema domains**: IAM (User/Profile), Catalog (Category/Destination/Activity/Amenity), Planning (Itinerary/Day/Item), Commerce (Booking/Review/Favorite), Content (BlogPost/Badge/UserBadge).
- **Prisma 7 adapter pattern**: Uses `@prisma/adapter-pg`. Both `PrismaService` and `prisma/seed.ts` must use `PrismaPg` adapter — plain `new PrismaClient()` will fail.
- **Client API calls**: All fetch calls use `API_URL` from `@/lib/api`. Auth tokens managed via `getAuthToken()`/`setAuthToken()`/`clearAuthToken()` helpers in same file.
- **Client routes**: `admin/`, `auth/`, `blog/`, `explorar/`, `institucional/`, `itinerarios/`, `planificar/`, `perfil/`, `proveedores/`.
- **Client components**: `features/ai-guide/`, `features/auth/`, `features/commerce/`, `features/hero/`, `features/home/`, `layout/`, `features/maps/`.
- **Brand palette** (defined in `globals.css` `@theme`): `volcano-black`, `nica-blue`, `selva-esmeralda`, `oro-indigena`, `volcan-magma`, `sunset-orange`.

## Env files

- `apps/server/.env` — `DATABASE_URL`, `GEMINI_API_KEY` (or `GOOGLE_CLOUD_PROJECT` for Vertex), `PINECONE_API_KEY`, `PORT`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- `apps/client/.env.local` — `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`, `NEXT_PUBLIC_API_URL`.
- Both are gitignored. Never commit secrets.
