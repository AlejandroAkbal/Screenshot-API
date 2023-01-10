FROM node:16-alpine

ARG PORT=3000

# Install chrome
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Set puppeteer user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
        && mkdir -p /home/pptruser/Downloads /app \
        && chown -R pptruser:pptruser /home/pptruser \
        && chown -R pptruser:pptruser /app

# Install PNPM
RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

# Create app directory
WORKDIR /app

# Install dependencies
COPY --chown=pptruser:pptruser package*.json pnpm-lock.yaml ./

ENV NODE_ENV production

RUN pnpm install --prod

# Bundle app source
COPY --chown=pptruser:pptruser . .

USER pptruser

EXPOSE $PORT

CMD [ "pnpm", "start" ]
