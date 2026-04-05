import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

import { env } from 'src/utils/env'

import type { JwtPayload } from './jwt.types'

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const token = this.extractToken(request)

        if (!token) throw new UnauthorizedException('Authorization token missing')

        try {
            request.user = await this.jwtService.verifyAsync<JwtPayload>(token, { secret: env.JWT_SECRET })
        } catch {
            throw new UnauthorizedException('Invalid or expired token')
        }

        return true
    }

    private extractToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
