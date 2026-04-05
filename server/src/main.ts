import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'

import { env } from 'src/utils/env'

import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true })

    app.use(helmet())

    app.setGlobalPrefix('api')

    await app.listen(env.PORT)
}

bootstrap().catch((error) => {
    console.error(error)
    process.exit(1)
})
