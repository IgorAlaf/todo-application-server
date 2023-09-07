import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({ credentials: true })
	app.use(cookieParser())
	app.setGlobalPrefix('api')
	app.useGlobalPipes(new ValidationPipe())
	const config = new DocumentBuilder()
		.setTitle('Todo application')
		.setDescription('Application for planning your days')
		.setVersion('1.0')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api/docs', app, document)
	await app.listen(7320)
}
bootstrap()
