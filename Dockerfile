FROM navikt/node-express:12.2.0-alpine
RUN apk --no-cache add curl
add ./build /var/server/build

EXPOSE 8000


