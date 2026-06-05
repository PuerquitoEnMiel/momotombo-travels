FROM node:20-alpine AS builder

WORKDIR /app

# Copy root config and package-lock (assuming monorepo style or shared lock)
COPY package-lock.json ./
COPY apps/server/package.json ./apps/server/

# Install dependencies for server
RUN cd apps/server && npm install

# Copy source
COPY apps/server ./apps/server

# Generate prisma and build
RUN cd apps/server && npx prisma generate && npm run build

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=builder /app/apps/server/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
