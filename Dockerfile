FROM navikt/node-express:12.2.0-alpine
RUN apk --no-cache add curl
ADD ./ /var/server/
RUN yarn
RUN yarn build

EXPOSE 8000
CMD ["yarn", "serve"]

