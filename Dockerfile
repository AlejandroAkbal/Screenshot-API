FROM node:21-alpine

ENV PORT 3000
ENV NODE_ENV production

# System dependencies
RUN apk add --no-cache curl

RUN npm install -g pnpm

# Install chrome - https://github.com/Zenika/alpine-chrome/blob/master/Dockerfile
RUN apk upgrade --no-cache --available \
    && apk add --no-cache \
      chromium-swiftshader \
      ttf-freefont \
      font-noto-emoji \
    && apk add --no-cache \
      --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community \
      font-wqy-zenhei

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true


# Create app directory
WORKDIR /app

RUN chown -R node:node /app

COPY --chown=node:node . .


# Install dependencies
RUN pnpm install --prod=false --frozen-lockfile


# Build app
RUN pnpm build


# Start
USER node

EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=5s --retries=3 CMD curl -f http://localhost:$PORT/v1/status || exit 1

# WARN: use with --init (docker run --init)
CMD [ "node", "dist/main.js" ]