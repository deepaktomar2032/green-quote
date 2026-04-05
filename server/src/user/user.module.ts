import { Module } from '@nestjs/common'

import { AdapterModule } from 'src/adapters/adapter.module'

import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'

@Module({
    imports: [AdapterModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
