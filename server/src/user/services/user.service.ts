import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UserAdapter } from 'src/adapters/user.adapter'
import type { JwtPayload } from 'src/auth/jwt.types'
import { LoginDto } from 'src/user/dto/login.dto'
import { SignupDto } from 'src/user/dto/signup.dto'
import type { AuthTokenResponse, PublicUser } from 'src/user/user.types'
import { SALT_ROUNDS } from 'src/utils/env'

@Injectable()
export class UserService {
    constructor(
        private readonly userAdapter: UserAdapter,
        private readonly jwtService: JwtService
    ) {}

    async signup(dto: SignupDto): Promise<PublicUser> {
        const existing = await this.userAdapter.findOne({ email: dto.email })

        if (existing) {
            throw new ConflictException('Email already in use')
        }

        const hashedPassword: string = await bcrypt.hash(dto.password, SALT_ROUNDS)

        return await this.userAdapter.insertUser({
            fullName: dto.fullName,
            email: dto.email,
            password: hashedPassword
        })
    }

    async login(dto: LoginDto): Promise<AuthTokenResponse> {
        const user = await this.userAdapter.findOne({ email: dto.email })

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const isMatch: boolean = await bcrypt.compare(dto.password, user.password)

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload: JwtPayload = { sub: user.id, email: user.email, fullName: user.fullName, isAdmin: user.isAdmin }
        const access_token: string = await this.jwtService.signAsync(payload)

        return { access_token }
    }
}
