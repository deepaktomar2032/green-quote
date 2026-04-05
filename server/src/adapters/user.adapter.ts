import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'

import { DatabaseService } from 'src/database/database.service'
import { PrismaService } from 'src/prisma.service'
import type { PublicUser } from 'src/user/user.types'

@Injectable()
export class UserAdapter extends DatabaseService<User> {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma.user, prisma, (client: PrismaService) => client.user)
    }

    async insertUser(data: Prisma.UserCreateInput): Promise<PublicUser> {
        return this.prisma.user.create({ data, omit: { password: true } })
    }
}
