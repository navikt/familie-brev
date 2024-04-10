FROM oven/bun:latest
USER bun
WORKDIR app

COPY build/index.js .


EXPOSE 8001
ENV NODE_ENV=production
ENTRYPOINT ["bun", "run", "index.js"]

