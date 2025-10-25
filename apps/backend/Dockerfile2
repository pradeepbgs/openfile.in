FROM oven/bun:latest as builder

WORKDIR /app

COPY package.json tsconfig.json ./

RUN apt-get update

RUN bun install

COPY . .


# COMPILE BINARY

RUN bun run compile

# RUNNER
FROM oven/bun:latest as runner

COPY --from=builder /app/app-server ./


EXPOSE 8000

ENTRYPOINT ["./app-server"]