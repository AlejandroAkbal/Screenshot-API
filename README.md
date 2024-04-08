<p align='center'>
<img
  src='.github/art/icon.svg'
  alt='Icon' height='100'/>
</p>

<h1 align='center'>
    Screenshot API
</h1>

A simple self-hosted API to take screenshots of websites using Puppeteer.

### Technologies

A [NestJS](https://nestjs.com/) wrapper around [capture-website](https://github.com/sindresorhus/capture-website).

Check the [package.json](package.json) for the full list of dependencies.

Check the [Dockerfile](Dockerfile) to see how the image is built.

### Endpoints

#### GET /v1/capture

| Parameter | Type   | Default Value | Description                  |
|-----------|--------|---------------|------------------------------|
| url       | string |               | URL to capture               |
| width     | number | 1024          | Viewport width               |
| height    | number | 768           | Viewport height              |
| scale     | number | 1             | Scale factor of the viewport |
| timeout   | number | 15            | Timeout before giving up     |
| delay     | number | 0             | Delay after page load        |
| mime_type | string | webp          | jpg, png or webp             |
| quality   | number | 0.8           | Image quality                |

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

docker run --init -p 3000:3000 screenshot-api
```
