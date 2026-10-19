FROM node:20-alpine AS builder

WORKDIR /app

# Disable husky install (no .git inside the build context)
ENV HUSKY=0

# Copy workspace manifests + root lockfile (single source of truth for versions)
COPY package.json package-lock.json ./
COPY apps/server/package.json ./apps/server/

# Reproducible install
RUN npm ci --workspace=server --include-workspace-root

# Copy source
COPY apps/server ./apps/server

# Generate prisma client and build
RUN cd apps/server && npx prisma generate && npm run build

FROM node:20-alpine AS production

WORKDIR /app/apps/server

ENV NODE_ENV=production

# npm hoists dependencies to the workspace root: copy both trees
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/server/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json
COPY --from=builder /app/apps/server/prisma ./prisma
COPY --from=builder /app/apps/server/prisma.config.ts ./prisma.config.ts

USER node

EXPOSE 3001
CMD ["npm", "run", "start:prod"]
