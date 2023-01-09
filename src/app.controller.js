import {Bind, Controller, Dependencies, Get, Query, ValidationPipe} from '@nestjs/common';
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
    getCapture(query) {

        return query;
    }
}
