FROM node:20-alpine AS builder
WORKDIR /app

# Disable husky install (no .git inside the build context)
ENV HUSKY=0

# Next.js inlines NEXT_PUBLIC_* at build time: they must be present during `next build`
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=$NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Copy workspace manifests + root lockfile (single source of truth for versions)
COPY package.json package-lock.json ./
COPY apps/client/package.json ./apps/client/

# Reproducible install
RUN npm ci --workspace=client --include-workspace-root

# Copy source
COPY apps/client ./apps/client

# Build
RUN npm run build --workspace=client

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/client/public ./public
COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./.next/static

USER node

EXPOSE 3000
CMD ["node", "server.js"]
