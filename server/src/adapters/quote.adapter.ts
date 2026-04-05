import { Injectable } from '@nestjs/common'
import { Quote } from '@prisma/client'

import { DatabaseService } from 'src/database/database.service'
import { PrismaService } from 'src/prisma.service'
import type { QuoteWithUser } from 'src/quote/quote.types'

@Injectable()
export class QuoteAdapter extends DatabaseService<Quote> {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma.quote, prisma, (client: PrismaService) => client.quote)
    }

    findAllWithUser(search?: string): Promise<QuoteWithUser[]> {
        return this.findEntries({
            where: search
                ? {
                      user: {
                          OR: [{ fullName: { contains: search } }, { email: { contains: search } }]
                      }
                  }
                : undefined,
            include: { user: { select: { fullName: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        }) as Promise<QuoteWithUser[]>
    }
}
