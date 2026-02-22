import { Test } from '@nestjs/testing'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
	let app: NestFastifyApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule]
		}).compile()

		app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter())
		app.enableVersioning({ type: VersioningType.URI })
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: true
			})
		)
		await app.init()
		await app.getHttpAdapter().getInstance().ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('/v1/status (GET)', async () => {
		const result = await app.inject({
			method: 'GET',
			url: '/v1/status'
		})
		expect(result.statusCode).toEqual(200)
		expect(result.json()).toEqual({ status: 'ok' })
	})

	it('/v1/capture (GET) returns image', async () => {
		const result = await app.inject({
			method: 'GET',
			url: '/v1/capture?url=https://example.com&width=1024&height=768&mime_type=webp'
		})
		expect(result.statusCode).toEqual(200)
		expect(result.headers['content-type']).toMatch(/^image\/(webp|png|jpeg)/)
		const buffer = Buffer.isBuffer(result.rawPayload) ? result.rawPayload : Buffer.from(result.rawPayload)
		expect(buffer.length).toBeGreaterThan(100)
	}, 30_000)
})
