### Stage 1 — deps
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

### Stage 2 — builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ces vars sont nécessaires à la compilation Next.js (NEXT_PUBLIC_*)
# Elles sont injectées depuis les secrets CI/CD au moment du build
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_DIRECTUS_URL
ARG NEXT_PUBLIC_DIRECTUS_ASSETS
ARG NEXT_PUBLIC_APP_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_DIRECTUS_URL=$NEXT_PUBLIC_DIRECTUS_URL \
    NEXT_PUBLIC_DIRECTUS_ASSETS=$NEXT_PUBLIC_DIRECTUS_ASSETS \
    NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

RUN corepack enable pnpm && pnpm build

### Stage 3 — runner (image minimale)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone output (next.config.mjs doit avoir output: 'standalone')
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
