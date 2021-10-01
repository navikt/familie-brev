FROM navikt/node-express:14-alpine
RUN apk --no-cache add curl
ADD ./ /var/server

EXPOSE 8001

CMD ["yarn", "start"]

