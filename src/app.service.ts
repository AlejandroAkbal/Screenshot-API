import { Injectable, StreamableFile } from '@nestjs/common'
import { CaptureDTO } from './dto/CaptureDTO'
//
import { chromium as browserApp } from 'playwright-extra'
import { PlaywrightBlocker } from '@cliqz/adblocker-playwright'
import type { Browser } from 'playwright'

const PuppeteerExtraPluginStealth = require('puppeteer-extra-plugin-stealth')

type GetCaptureOptions = {
	delay: number
	mime_type: 'jpeg' | 'png'
	width: number
	scale: number
	url: string
	timeout: number
	height: number
	quality: number
}

@Injectable()
export class AppService {
	private static async captureScreenshot(
		options: GetCaptureOptions,
		browser: Browser,
		playwrightBlocker: PlaywrightBlocker
	) {
		try {
			const page = await browser.newPage({
				acceptDownloads: false,

				viewport: {
					width: options.width,
					height: options.height
				},

				deviceScaleFactor: options.scale
			})

			await playwrightBlocker.enableBlockingInPage(page)

			await page.goto(options.url, {
				timeout: options.timeout,

				// Fix for SPAs
				waitUntil: 'networkidle'
			})

			const screenshotBuffer = await page.screenshot({
				animations: 'disabled',
				quality: options.quality,
				type: options.mime_type
			})

			return screenshotBuffer

			//
		} finally {
			await browser.close()
		}
	}

	private static async setupBrowser(): Promise<{ browser: Browser; playwrightBlocker: PlaywrightBlocker }> {
		const stealthPlugin = PuppeteerExtraPluginStealth()
		browserApp.use(stealthPlugin)

		const playwrightBlocker = await PlaywrightBlocker.fromPrebuiltFull()

		const browser = await browserApp.launch({
			headless: true,
			args: [
				// Insecure way to allow it running in Docker
				// '--no-sandbox',
				// '--disable-setuid-sandbox',
				'--disable-gpu',

				// Aesthetic
				'--hide-scrollbars',
				'--mute-audio',
				'--use-fake-ui-for-media-stream' // Pages that ask for webcam/microphone access
			]
		})

		return { browser, playwrightBlocker }
	}

	getStatus() {
		return { status: 'ok' }
	}

	async getCapture(query: CaptureDTO) {
		const options: GetCaptureOptions = {
			url: query.url,
			width: query.width,
			height: query.height,
			scale: query.scale,
			timeout: query.timeout * 1000,
			delay: query.delay * 1000,
			mime_type: query.mime_type,
			quality: query.quality
		}

		// TODO: Validate options (quality not set if mime_type is png)

		const { browser, playwrightBlocker } = await AppService.setupBrowser()

		const screenshotBuffer = await AppService.captureScreenshot(options, browser, playwrightBlocker)

		return new StreamableFile(screenshotBuffer, {
			disposition: 'inline',
			// TODO: use https://github.com/sindresorhus/file-type/
			type: `image/${options.mime_type}`,
			length: screenshotBuffer.length
		})
	}
}
