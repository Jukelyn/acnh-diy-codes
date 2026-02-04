# syntax=docker.io/docker/dockerfile:1

FROM node:25-alpine AS base

# -----------------------------
# deps: install dependencies
# -----------------------------
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Alpine node doesn't ship corepack, so install pnpm manually
RUN npm install -g pnpm@latest \
  && pnpm install --frozen-lockfile \
  && pnpm store prune \
  && rm -rf /root/.npm

# -----------------------------
# builder: build Next.js app
# -----------------------------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm@latest \
  && pnpm run build

# -----------------------------
# runner: smallest production image
# -----------------------------
FROM node:25-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S nodejs -g 1001 \
  && adduser -S nextjs -u 1001

# Copy only runtime files
COPY --from=builder /app/public ./public

# Standalone output = minimal runtime bundle
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
