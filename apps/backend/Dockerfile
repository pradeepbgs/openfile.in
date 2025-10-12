FROM oven/bun:latest 

WORKDIR /app

# RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*


COPY package.json tsconfig.json ./

RUN apt-get update -y && apt-get install -y openssl
# RUN apt-get update -y 

COPY . .

RUN bun install


EXPOSE 8000

ENTRYPOINT ["bun", "run", "start"]