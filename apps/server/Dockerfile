FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files for workspace support
COPY package.json ./
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN npm install --workspace=server

# Copy source
COPY apps/server ./apps/server

# Generate prisma and build
RUN cd apps/server && npx prisma generate && npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/apps/server/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./

EXPOSE 3001
CMD ["npm", "run", "start:prod"]
