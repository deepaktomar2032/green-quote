import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { Quote } from '@prisma/client'

import { Admin, Auth } from 'src/auth/auth.decorator'
import { CurrentUser } from 'src/auth/current-user.decorator'
import type { JwtPayload } from 'src/auth/jwt.types'
import { CreateQuoteDto } from 'src/quote/dto/create-quote.dto'
import type { QuoteResult, QuoteWithUser } from 'src/quote/quote.types'
import { QuoteService } from 'src/quote/services/quote.service'

@Auth()
@ApiTags('quotes')
@ApiBearerAuth()
@Controller('quotes')
export class QuoteController {
    constructor(private readonly quoteService: QuoteService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new pre-qualification quote' })
    @ApiResponse({ status: 201, description: 'Quote created with computed pricing and installment offers' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createQuote(@CurrentUser() user: JwtPayload, @Body() dto: CreateQuoteDto): Promise<QuoteResult> {
        return this.quoteService.createQuote(user.sub, dto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all quotes for the authenticated user' })
    @ApiResponse({ status: 200, description: 'List of quotes belonging to the current user' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getUserQuotes(@CurrentUser() user: JwtPayload): Promise<Quote[]> {
        return this.quoteService.getUserQuotes(user.sub)
    }

    @Admin()
    @Get('admin/all')
    @ApiOperation({
        summary: 'Get all quotes across all users (admin only)',
        description: 'Requires admin role. Optionally filter by user name or email.'
    })
    @ApiQuery({ name: 'search', required: false, description: 'Filter by user full name or email (min. 3 characters)' })
    @ApiResponse({ status: 200, description: 'List of all quotes with associated user info' })
    @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
    async getAllQuotes(@Query('search') search?: string): Promise<QuoteWithUser[]> {
        return this.quoteService.getAllQuotes(search)
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get a single quote by ID',
        description: 'Owners can access their own quotes. Admins can access any quote.'
    })
    @ApiResponse({ status: 200, description: 'Quote details with installment offers' })
    @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
    @ApiResponse({ status: 404, description: 'Quote not found' })
    async getQuoteById(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<QuoteResult> {
        return this.quoteService.getQuoteById(id, user.sub, user.isAdmin)
    }
}
