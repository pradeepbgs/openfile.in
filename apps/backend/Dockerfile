FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

EXPOSE 8000

CMD ["bun", "index.ts"]
