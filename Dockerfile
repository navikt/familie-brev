FROM navikt/node-express:16
ADD ./ /var/server

EXPOSE 8001

CMD ["yarn", "start"]

