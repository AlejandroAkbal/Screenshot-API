<p align='center'>
  <svg xmlns="http://www.w3.org/2000/svg" width="6rem" height="6rem" viewBox="0 0 24 24"><g fill="currentColor"><path d="M4 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm4-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm2 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path fill-rule="evenodd" d="M3 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H3Zm18 2H3a1 1 0 0 0-1 1v3h20V6a1 1 0 0 0-1-1ZM2 18v-7h20v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z" clip-rule="evenodd"/></g></svg>
</p>

<h1 align='center'>
    Screenshot API
</h1>

## Description

A simple self-hosted API to take screenshots of websites using Puppeteer.

### Technologies

A [NestJS](https://nestjs.com/) wrapper around [capture-website](https://github.com/sindresorhus/capture-website).

Check the [package.json](package.json) for the full list of dependencies.

Check the [Dockerfile](Dockerfile) to see how the image is built.

### Endpoints

#### GET /capture

| Parameter | Type   | Default Value | Description            |
| --------- | ------ | ------------- | ---------------------- |
| url       | string |               | URL to capture         |
| width     | number | 1024          | Width of the viewport  |
| height    | number | 768           | Height of the viewport |
| delay     | number | 0             | Delay before capturing |
| mime_type | string | webp          | Mime type of the image |
| quality   | number | 0.8           | Quality of the image   |

You can view the full query parameters [here](src/dto/CaptureDTO.js).

## Development

### Installation

```bash
pnpm install
```

### Configuration

```bash
cp .env.example .env
nano .env
```

### Running the app

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

### Test

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

## Building for production

```bash
docker build -t screenshot-api .

docker run -p 5000:5000 screenshot-api
```
