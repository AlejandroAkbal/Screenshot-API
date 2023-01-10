import {
  Bind,
  Controller,
  Dependencies,
  Get,
  Header,
  Query,
  StreamableFile,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CaptureDTO } from './dto/CaptureDTO';

@Controller({
  version: '1',
})
@Dependencies(AppService)
export class AppController {
  constructor(appService) {
    this.appService = appService;
  }

  @Get('capture')
  @Bind(
    Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        expectedType: CaptureDTO,
      }),
    ),
  )
  // Cache 1 hour on CDN | Cache 30 minutes on client | Stale while revalidate 30 minutes
  @Header(
    'Cache-Control',
    'max-age=1800, s-maxage=3600, stale-while-revalidate=1800',
  )
  async getCapture(query) {
    /**
     * @type {import('capture-website')}
     */
    const { default: captureWebsite } = await eval(`import('capture-website')`);

    const websiteBuffer = await captureWebsite.buffer(
      query.url,
      {
        width: query.width,
        height: query.height,

        type: query.mime_type,
        quality: query.quality,

        timeout: 5, // In seconds
        delay: query.delay,

        disableAnimations: true,
        blockAds: true,
      },
      {
        launchOptions: {
          // Insecure way to allow it running in Docker
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    );

    return new StreamableFile(websiteBuffer, {
      disposition: 'inline',
      type: `image/${query.mime_type}`,
      length: websiteBuffer.length,
    });
  }
}
