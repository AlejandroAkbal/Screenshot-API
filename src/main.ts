import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppClusterService } from './cluster.service'
import compression from '@fastify/compress'
import helmet from '@fastify/helmet'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
	const configService = app.get(ConfigService)

	app.enableVersioning({
		type: VersioningType.URI
	})

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)

	await app.register(compression, { encodings: ['gzip', 'deflate'] })

	await app.register(helmet, {
		crossOriginResourcePolicy: false,
		crossOriginEmbedderPolicy: false,
		crossOriginOpenerPolicy: false
	})

	app.enableCors({
		origin: configService.get('allowedHosts'),
		credentials: true
	})

	await app.listen(configService.get('port') as number, '0.0.0.0')
}

AppClusterService.clusterize(bootstrap)
