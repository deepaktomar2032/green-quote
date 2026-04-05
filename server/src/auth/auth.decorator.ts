import { UseGuards, applyDecorators } from '@nestjs/common'

import { AdminGuard } from './admin.guard'
import { JwtGuard } from './jwt.guard'

export const Auth = () => applyDecorators(UseGuards(JwtGuard))
export const Admin = () => applyDecorators(UseGuards(JwtGuard, AdminGuard))
