import {NestFactory} from '@nestjs/core';
import {FastifyAdapter} from '@nestjs/platform-fastify';
import {AppModule} from './app.module';
import {VersioningType} from "@nestjs/common";
import compression from '@fastify/compress'
import helmet from '@fastify/helmet'

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule,
        new FastifyAdapter()
    );

    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.register(helmet)
    await app.register(compression, {encodings: ['gzip', 'deflate']});

    // app.enableCors((req, callback) => {
    //     const isDomainAllowed = ALLOWED_HOSTS.includes(req.hostname);
    //
    //     callback(null, {
    //         origin: isDomainAllowed,
    //         credentials: true,
    //     });
    // })

    await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
