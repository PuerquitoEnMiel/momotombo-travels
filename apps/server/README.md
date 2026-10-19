# Momotombo Travels — Server

NestJS 11 + Prisma 7 + PostgreSQL backend for Momotombo Travels. Provides REST APIs for auth (JWT + Google OAuth), destinations, itineraries, bookings, reviews, blog, coupons, admin, plus Google Gemini AI and Pinecone vector search, Stripe payments, Prometheus metrics, and Pino logging. Port **3001** in development.

This app is part of an npm-workspaces monorepo. Install dependencies from the repository root only (`npm install` at the root) — see the [root README](../../README.md) for full setup instructions.

## Commands (run from `apps/server`)

| Task | Command |
|---|---|
| Dev server (port 3001) | `npm run start:dev` |
| Build | `npm run build` |
| Start built app | `npm run start:prod` |
| Lint (auto-fix) | `npm run lint` |
| Format | `npm run format` |
| Unit tests (Jest + ts-jest) | `npm run test` |
| Test coverage | `npm run test:cov` |
| E2E tests (Jest + Supertest) | `npm run test:e2e` |
| Prisma generate | `npx prisma generate` |
| DB migrations | `npx prisma migrate deploy` |
| Seed database | `npx prisma db seed` |
| Check available Gemini models | `npm run check-models` |

## Environment variables (`.env`, names only)

- `DATABASE_URL`
- `GEMINI_API_KEY` (or `GOOGLE_CLOUD_PROJECT` when using Vertex)
- `PINECONE_API_KEY`
- `PORT`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `THROTTLE_TTL_MS` / `THROTTLE_LIMIT` (optional; rate limiting defaults to 20 req/min)
- `SHADOW_DATABASE_URL` (optional; enables `prisma migrate dev` / `migrate diff`)

Never commit real values; `.env` is gitignored.

## Notes

- Module resolution is `nodenext` (ESM); imports may need file extensions.
- No path aliases — use relative imports.
- Prisma 7 uses the `@prisma/adapter-pg` adapter (`PrismaPg`); plain `new PrismaClient()` will not work.
- Prisma config lives in `prisma.config.ts` and reads `DATABASE_URL` from `.env`.
- If your dev database was created with `prisma db push`, run `npx prisma migrate reset` to align it with the migration history.

See the [root README](../../README.md) and [ARCHITECTURE.md](../../ARCHITECTURE.md) for the bigger picture.
