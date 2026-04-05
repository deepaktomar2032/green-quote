import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Quote } from '@prisma/client'

import { QuoteAdapter } from 'src/adapters/quote.adapter'
import { RiskBand } from 'src/pricing/pricing.config'
import { PricingService } from 'src/pricing/pricing.service'
import { CreateQuoteDto } from 'src/quote/dto/create-quote.dto'
import type { QuoteOffer, QuoteResult, QuoteWithUser } from 'src/quote/quote.types'

@Injectable()
export class QuoteService {
    constructor(
        private readonly quoteAdapter: QuoteAdapter,
        private readonly pricingService: PricingService
    ) {}

    async createQuote(userId: string, dto: CreateQuoteDto): Promise<QuoteResult> {
        const systemPrice: number = this.pricingService.computeSystemPrice(dto.systemSizeKw)
        const downPayment: number = dto.downPayment ?? 0
        const principal: number = systemPrice - downPayment
        const riskBand: RiskBand = this.pricingService.computeRiskBand(dto.monthlyConsumptionKwh, dto.systemSizeKw)
        const offers: QuoteOffer[] = this.pricingService.computeOffers(principal, riskBand)

        const quote: Quote = await this.quoteAdapter.insertEntry({
            userId,
            address: dto.address,
            monthlyConsumptionKwh: dto.monthlyConsumptionKwh,
            systemSizeKw: dto.systemSizeKw,
            downPayment,
            systemPrice,
            riskBand,
            offers: JSON.stringify(offers)
        })

        return this.toResult(quote, offers)
    }

    async getQuoteById(id: string, userId: string, isAdmin: boolean): Promise<QuoteResult> {
        const quote = await this.quoteAdapter.findOne({ id })

        if (!quote) throw new NotFoundException('Quote not found')

        if (!isAdmin && quote.userId !== userId) throw new ForbiddenException('Access denied')

        return this.toResult(quote, JSON.parse(quote.offers) as QuoteOffer[])
    }

    async getUserQuotes(userId: string): Promise<Quote[]> {
        return this.quoteAdapter.findMany({ userId })
    }

    async getAllQuotes(search?: string): Promise<QuoteWithUser[]> {
        return this.quoteAdapter.findAllWithUser(search)
    }

    private toResult(quote: Quote, offers: QuoteOffer[]): QuoteResult {
        return {
            id: quote.id,
            userId: quote.userId,
            address: quote.address,
            monthlyConsumptionKwh: quote.monthlyConsumptionKwh,
            systemSizeKw: quote.systemSizeKw,
            downPayment: quote.downPayment,
            systemPrice: quote.systemPrice,
            riskBand: quote.riskBand,
            offers,
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt
        }
    }
}
