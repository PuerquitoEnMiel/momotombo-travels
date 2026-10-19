# Momotombo Travels — Client

Next.js 16 (App Router) + React 19 + Tailwind v4 frontend for Momotombo Travels. Includes the AI travel guide ("El Guía Nica"), destination exploration, itineraries, bookings, blog, and the admin dashboard. Port **3000** in development.

This app is part of an npm-workspaces monorepo. Install dependencies from the repository root only (`npm install` at the root) — see the [root README](../../README.md) for full setup instructions.

## Commands (run from `apps/client`)

| Task | Command |
|---|---|
| Dev server (port 3000) | `npm run dev` |
| Production build | `npm run build` |
| Start built app | `npm run start` |
| Lint | `npm run lint` |
| Unit tests (Vitest + Testing Library) | `npm run test` |
| Unit tests, single run (CI) | `npm run test:ci` |
| Unit tests with coverage | `npm run test:coverage` |
| E2E tests (Playwright) | `npm run test:e2e` |

## Environment variables (`.env.local`, names only)

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL` (optional; inlined at build time)

`NEXT_PUBLIC_*` values are inlined by Next.js at build time — set them before `npm run build`. Never commit real values; `.env.local` is gitignored.

## Notes

- Path alias `@/*` maps to `./src/*`.
- Tailwind v4 is configured CSS-first in `src/app/globals.css` via `@theme` (no `tailwind.config.ts`).
- TypeScript runs with `strict: true`.
- Icons come from `@phosphor-icons/react`; Unicode emojis are not allowed in the UI.
- The Next.js `output: 'standalone'` setting is required by the Dockerfile — do not change it.

See the [root README](../../README.md) and [ARCHITECTURE.md](../../ARCHITECTURE.md) for the bigger picture.
