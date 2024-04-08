import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
	let appController: AppController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService]
		}).compile()

		appController = app.get<AppController>(AppController)
	})

	describe('/v1/status', () => {
		//

		test('GET', () => {
			expect(appController.getStatus()).toEqual({ status: 'ok' })
		})
	})

	describe('/v1/capture', () => {
		//

		test('GET akbal.dev', async () => {
			// Expect WEBP image

			await appController.getCapture(undefined, {
				url: 'https://akbal.dev'
			})
		})
	})
})
