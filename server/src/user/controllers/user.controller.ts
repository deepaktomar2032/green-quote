import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { LoginDto } from 'src/user/dto/login.dto'
import { SignupDto } from 'src/user/dto/signup.dto'
import { UserService } from 'src/user/services/user.service'
import type { AuthTokenResponse, PublicUser } from 'src/user/user.types'

@ApiTags('auth')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    async signup(@Body() dto: SignupDto): Promise<PublicUser> {
        return this.userService.signup(dto)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Log in and receive a JWT access token' })
    @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { access_token: 'eyJhbGci...' } } })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() dto: LoginDto): Promise<AuthTokenResponse> {
        return this.userService.login(dto)
    }
}
