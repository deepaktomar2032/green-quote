import './polyfills'

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { Logger } from 'nestjs-pino'

import { env } from 'src/utils/env'

import { AppModule } from './app.module'
import { setupShutdownHandlers } from './instrumentation'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true })
    app.useLogger(app.get(Logger))

    app.use(helmet())

    app.setGlobalPrefix('api')

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

    const swaggerConfig = new DocumentBuilder()
        .setTitle('GreenQuote API')
        .setDescription('Solar financing pre-qualification API')
        .setVersion('1.0')
        .addBearerAuth()
        .build()

    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api/docs', app, document)

    await app.listen(env.PORT)

    setupShutdownHandlers(app)
}

bootstrap().catch((error) => {
    console.error(error)
    process.exit(1)
})
