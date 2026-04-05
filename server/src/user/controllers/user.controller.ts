import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { LoginDto } from 'src/user/dto/login.dto'
import { SignupDto } from 'src/user/dto/signup.dto'
import { UserService } from 'src/user/services/user.service'
import type { AuthTokenResponse, PublicUser } from 'src/user/user.types'

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    async signup(@Body() dto: SignupDto): Promise<PublicUser> {
        return this.userService.signup(dto)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto): Promise<AuthTokenResponse> {
        return this.userService.login(dto)
    }
}
