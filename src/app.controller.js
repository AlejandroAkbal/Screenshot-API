import { Bind, Controller, Dependencies, Get, Header, Query, StreamableFile, ValidationPipe } from '@nestjs/common'
import { AppService } from './app.service'
import { CaptureDTO } from './dto/CaptureDTO'

@Controller({
	version: '1'
})
@Dependencies(AppService)
export class AppController {
	constructor(appService) {
		this.appService = appService
	}

	@Get('status')
	getStatus() {
		return { status: 'ok' }
	}

	@Get('capture')
	@Bind(
		Query(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: true,
				expectedType: CaptureDTO
			})
		)
	)
	// Cache 12 hours on client | Cache 12 hours on CDN | Stale while revalidate 30 minutes
	@Header('Cache-Control', 'max-age=43200, s-maxage=43200, stale-while-revalidate=1800')
	async getCapture(query) {
		/**
		 * @type {import('capture-website')}
		 */
		const { default: captureWebsite } = await eval(`import('capture-website')`)

		const websiteBuffer = await captureWebsite.buffer(query.url, {
			width: query.width,
			height: query.height,

			scaleFactor: 1,

			type: query.mime_type,
			quality: query.quality,

			timeout: 10, // In seconds
			delay: query.delay,

			disableAnimations: true,
			blockAds: true,

			userAgent:
				'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',

			launchOptions: {
				args: [
					// Insecure way to allow it running in Docker
					'--headless',
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-gpu',

					// Aesthetic
					'--hide-scrollbars',
					'--mute-audio',
					'--use-fake-ui-for-media-stream' // Pages that ask for webcam/microphone access
				]
			}
		})

		return new StreamableFile(websiteBuffer, {
			disposition: 'inline',
			type: `image/${query.mime_type}`,
			length: websiteBuffer.length
		})
	}
}
