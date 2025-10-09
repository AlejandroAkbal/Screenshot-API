import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppClusterService } from './cluster.service'
import fastifyCompress from '@fastify/compress'
import fastifyHelmet from '@fastify/helmet'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
	const configService = app.get(ConfigService)

	app.useStaticAssets({
		root: join(__dirname, '..', 'public')
	})

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

	await app.register(fastifyCompress, { encodings: ['gzip', 'deflate'] })

	await app.register(fastifyHelmet, {
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
