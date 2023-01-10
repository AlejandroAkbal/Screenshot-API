import {Bind, Controller, Dependencies, Get, Query, StreamableFile, ValidationPipe} from '@nestjs/common';
import {AppService} from './app.service';
import {CaptureDTO} from "./dto/CaptureDTO";

@Controller({
    version: '1',
})
@Dependencies(AppService)
export class AppController {
    constructor(appService) {
        this.appService = appService;
    }

    @Get('capture')
    @Bind(Query(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        expectedType: CaptureDTO
    })))
    async getCapture(query) {
        /**
         * @type {import('capture-website')}
         */
        const {default: captureWebsite} = await (eval(`import('capture-website')`));

        const websiteBuffer = await captureWebsite.buffer(query.url, {
            width: query.width,
            height: query.height,

            type: query.mime_type,
            quality: query.quality,

            timeout: 5, // In seconds
            delay: query.delay,

            disableAnimations: true,
            blockAds: true,
        });

        return new StreamableFile(websiteBuffer)
    }
}
