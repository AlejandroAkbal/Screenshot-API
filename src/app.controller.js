import {Controller, Dependencies, Get} from '@nestjs/common';
import {AppService} from './app.service';

@Controller({
    version: '1',
})
@Dependencies(AppService)
export class AppController {
    constructor(appService) {
        this.appService = appService;
    }

    @Get()
    getHello() {
        return this.appService.getHello();
    }
}
