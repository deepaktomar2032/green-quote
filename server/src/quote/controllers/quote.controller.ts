import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import type { Quote } from '@prisma/client'

import { Admin, Auth } from 'src/auth/auth.decorator'
import { CurrentUser } from 'src/auth/current-user.decorator'
import type { JwtPayload } from 'src/auth/jwt.types'
import { CreateQuoteDto } from 'src/quote/dto/create-quote.dto'
import type { QuoteResult, QuoteWithUser } from 'src/quote/quote.types'
import { QuoteService } from 'src/quote/services/quote.service'

@Auth()
@Controller('quotes')
export class QuoteController {
    constructor(private readonly quoteService: QuoteService) {}

    @Post()
    async createQuote(@CurrentUser() user: JwtPayload, @Body() dto: CreateQuoteDto): Promise<QuoteResult> {
        return this.quoteService.createQuote(user.sub, dto)
    }

    @Get()
    async getUserQuotes(@CurrentUser() user: JwtPayload): Promise<Quote[]> {
        return this.quoteService.getUserQuotes(user.sub)
    }

    @Admin()
    @Get('admin/all')
    async getAllQuotes(@Query('search') search?: string): Promise<QuoteWithUser[]> {
        return this.quoteService.getAllQuotes(search)
    }

    @Get(':id')
    async getQuoteById(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<QuoteResult> {
        return this.quoteService.getQuoteById(id, user.sub, user.isAdmin)
    }
}
