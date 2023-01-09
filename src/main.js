import {NestFactory} from '@nestjs/core';
import {FastifyAdapter} from '@nestjs/platform-fastify';
import {AppModule} from './app.module';
import {VersioningType} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule,
        new FastifyAdapter()
    );

    app.enableVersioning({
        type: VersioningType.URI,
    });

    await app.listen(3000, '0.0.0.0');
}

bootstrap();
