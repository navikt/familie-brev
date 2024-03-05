FROM oven/bun:latest

WORKDIR /usr/src/app

COPY src ./src
COPY node_modules ./node_modules
COPY package.json .

EXPOSE 8001

ENV NODE_ENV=production

ENTRYPOINT ["bun", "run", "src/server/index.ts"]

