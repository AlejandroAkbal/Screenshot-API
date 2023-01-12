import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,

			load: [configuration]
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
