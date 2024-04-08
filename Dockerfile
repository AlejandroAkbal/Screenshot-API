FROM node:21-slim

ENV PORT 3000
ENV NODE_ENV production

# System dependencies
RUN npm install -g pnpm


# Create app directory
WORKDIR /app

COPY . .


# Install dependencies
RUN pnpm install --prod=false --frozen-lockfile

RUN pnpm exec playwright install --with-deps chromium


# Build app
RUN pnpm build


# Start
EXPOSE $PORT

# WARN: use with tini
CMD [ "node", "dist/main.js" ]