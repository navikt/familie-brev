FROM ghcr.io/navikt/baseimages/node-express:18
ADD ./ /var/server

EXPOSE 8001

CMD ["yarn", "start"]

