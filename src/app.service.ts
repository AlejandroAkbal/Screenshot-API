import { Injectable, StreamableFile } from '@nestjs/common'
import { CaptureDTO } from './dto/CaptureDTO'

@Injectable()
export class AppService {
	getStatus() {
		return { status: 'ok' }
	}

	async getCapture(query: CaptureDTO) {
		/**
		 * @type {import('capture-website')}
		 */
		const { default: captureWebsite } = await eval(`import('capture-website')`)

		const websiteBuffer = await captureWebsite.buffer(query.url, {
			width: query.width,
			height: query.height,

			scaleFactor: query.scale,

			type: query.mime_type,
			quality: query.quality,

			timeout: query.timeout,
			delay: query.delay,

			disableAnimations: true,
			blockAds: true,

			userAgent:
				'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',

			launchOptions: {
				// https://cri.dev/posts/2020-04-04-Full-list-of-Chromium-Puppeteer-flags/
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
