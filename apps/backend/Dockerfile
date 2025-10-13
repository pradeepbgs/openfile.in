FROM oven/bun:latest 

WORKDIR /app

COPY package.json tsconfig.json ./

RUN apt-get update -y && apt-get install -y openssl

COPY . .

RUN bun install


EXPOSE 8000

ENTRYPOINT ["bun", "run", "start"]