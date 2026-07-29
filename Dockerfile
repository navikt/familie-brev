FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim
WORKDIR /var/server

COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json .

EXPOSE 8001

ENV NODE_ENV=production

CMD ["--import=./dist/src/server/register.js", "--es-module-specifier-resolution=node", "dist/src/server/index.js"]

