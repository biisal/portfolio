# ============================================
# Stage 1: Base — pnpm + Node.js runtime
# ============================================
FROM ghcr.io/pnpm/pnpm:12 AS base
RUN pnpm runtime set node 24 -g

# ============================================
# Stage 2: Dependencies Installation
# ============================================
FROM base AS dependencies

WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ============================================
# Stage 3: Build Next.js application in standalone mode
# ============================================
FROM base AS builder

WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY . .

ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# ============================================
# Stage 4: Run Next.js application
# ============================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# ENV NEXT_TELEMETRY_DISABLED=1

# Copy production assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["pnpm", "runtime", "exec", "node", "server.js"]