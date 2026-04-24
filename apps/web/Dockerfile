# syntax=docker/dockerfile:1.7
#
# Monorepo pnpm + Next.js standalone.
# Build context: repo root (configured in CI workflow).

### Stage 1 — deps (cache-friendly: only package metadata)
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /repo
RUN corepack enable

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/directus/package.json ./apps/directus/
COPY packages/config/package.json ./packages/config/
COPY packages/lib/package.json ./packages/lib/
COPY packages/ui/package.json ./packages/ui/

RUN pnpm install --frozen-lockfile

### Stage 2 — builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /repo
RUN corepack enable

COPY --from=deps /repo ./
COPY . .

# Public vars bake into the client bundle — override via CI build-args.
ARG NEXT_PUBLIC_SITE_URL=https://build.example.com
ARG NEXT_PUBLIC_DIRECTUS_URL=https://build.example.com
ARG NEXT_PUBLIC_DIRECTUS_ASSETS=https://build.example.com/assets/
ARG NEXT_PUBLIC_APP_ENV=production

# Server-only placeholders: satisfy zod env schema at build time.
# Never used at runtime — real values are injected by the deploy platform.
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_DIRECTUS_URL=$NEXT_PUBLIC_DIRECTUS_URL \
    NEXT_PUBLIC_DIRECTUS_ASSETS=$NEXT_PUBLIC_DIRECTUS_ASSETS \
    NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV \
    DIRECTUS_URL=https://build.example.com \
    DIRECTUS_PUBLIC_URL=https://build.example.com \
    NEXT_REVALIDATE_TOKEN=build-time-placeholder-token

RUN pnpm --filter web build

### Stage 3 — runner (minimal image with Next standalone output)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js standalone in monorepo mode emits apps/web/server.js under the
# standalone dir, with node_modules and traced workspace files alongside.
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
