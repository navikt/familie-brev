FROM ghcr.io/navikt/baseimages/node-express:18
WORKDIR /var/server

COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json .

EXPOSE 8001

CMD ["yarn", "start"]

