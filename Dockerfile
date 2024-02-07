FROM gcr.io/distroless/nodejs:18
ADD ./ /var/server

EXPOSE 8001

CMD ["yarn", "start"]

