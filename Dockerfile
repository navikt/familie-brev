FROM gcr.io/distroless/nodejs18-debian12:nonroot
WORKDIR /var/server

COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json .

EXPOSE 8001

CMD ["--es-module-specifier-resolution=node", "dist/src/server/index.js"]

