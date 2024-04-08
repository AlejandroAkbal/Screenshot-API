import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { ConfigModule } from '@nestjs/config'

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
