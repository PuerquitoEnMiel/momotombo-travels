FROM node:20-alpine AS builder
WORKDIR /app

# Copy root package files for workspace support
COPY package.json ./
COPY apps/client/package.json ./apps/client/

# Install dependencies
RUN npm install --workspace=client

# Copy source
COPY apps/client ./apps/client

# Build
RUN cd apps/client && npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/client/public ./public
COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
