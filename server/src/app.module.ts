import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import type { StringValue } from 'ms'

import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { env } from './utils/env'

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: env.JWT_SECRET,
            signOptions: { expiresIn: env.JWT_EXPIRES_IN as StringValue | number }
        }),
        UserModule
    ],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
