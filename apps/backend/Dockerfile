FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json tsconfig.json ./

RUN bun install

COPY . .

RUN bun run compile

FROM oven/bun:latest AS runner

WORKDIR /app

COPY --from=builder /app/app-server ./

EXPOSE 8000

ENTRYPOINT ["./app-server"]
