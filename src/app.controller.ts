import { Controller, Get, Query, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { CaptureDTO } from './dto/CaptureDTO'
import { FastifyReply } from 'fastify'

@Controller({
	version: '1'
})
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('status')
	getStatus() {
		return this.appService.getStatus()
	}

	@Get('capture')
	async getCapture(
		//
		@Res({ passthrough: true }) response: FastifyReply,
		@Query() query: CaptureDTO
	) {
		// TODO: Refactor
		// In case of error, do not cache
		response.header('Cache-Control', 'no-cache')

		const capture = await this.appService.getCapture(query)

		// Cache 12 hours on client | Cache 12 hours on CDN | Stale while revalidate 30 minutes
		response.header('Cache-Control', 'max-age=43200, s-maxage=43200, stale-while-revalidate=1800')

		return capture
	}
}
