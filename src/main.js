import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { VersioningType } from '@nestjs/common'
import compression from '@fastify/compress'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, new FastifyAdapter())
	const configService = app.get(ConfigService)

	app.enableVersioning({
		type: VersioningType.URI
	})

	await app.register(compression, { encodings: ['gzip', 'deflate'] })

	// app.register(helmet, {
	// 	crossOriginResourcePolicy: false,
	// 	crossOriginEmbedderPolicy: false,
	//  crossOriginOpenerPolicy: false
	// })

	app.enableCors({
		origin: configService.get('allowedHosts'),
		credentials: true
	})

	await app.listen(configService.get('port'), '0.0.0.0')
}

bootstrap()
