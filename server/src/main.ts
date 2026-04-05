import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { Logger } from 'nestjs-pino'

import { env } from 'src/utils/env'

import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true })
    app.useLogger(app.get(Logger))

    app.use(helmet())

    app.setGlobalPrefix('api')

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

    await app.listen(env.PORT)
}

bootstrap().catch((error) => {
    console.error(error)
    process.exit(1)
})
