# ── Stage 1: Builder ──────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock* bun.lockb* ./
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY prisma.config.ts ./
COPY prisma/ ./prisma/

RUN bun install

COPY src/ ./src/

RUN bunx prisma generate
RUN bun run build

# ── Stage 2: Production ──────────────────────────────────────────────────
FROM oven/bun:1-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER bun

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["sh", "-c", "bunx prisma db push && bun run dist/main.js"]