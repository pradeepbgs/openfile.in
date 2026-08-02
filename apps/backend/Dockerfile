FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN bun install --frozen-lockfile

COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

RUN bun run compile

FROM oven/bun:latest AS runner

WORKDIR /app

COPY --from=builder /app/apps/backend/app-server ./

EXPOSE 8000

ENTRYPOINT ["./app-server"]
