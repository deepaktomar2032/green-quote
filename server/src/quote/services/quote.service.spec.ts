import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Quote } from '@prisma/client'

import { QuoteAdapter } from 'src/adapters/quote.adapter'
import { PricingService } from 'src/pricing/pricing.service'

import { QuoteService } from './quote.service'

const mockQuote: Quote = {
    id: 'uuid-quote-1',
    userId: 'uuid-user-42',
    address: '123 Solar St',
    monthlyConsumptionKwh: 400,
    systemSizeKw: 5,
    downPayment: 1000,
    systemPrice: 6000,
    riskBand: 'A',
    offers: JSON.stringify([{ termYears: 5, apr: 0.069, principalUsed: 5000, monthlyPayment: 98.52 }]),
    createdAt: new Date(),
    updatedAt: new Date()
}

const mockQuoteAdapter = {
    insertEntry: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    findAllWithUser: jest.fn()
} as unknown as QuoteAdapter

describe('QuoteService', () => {
    let service: QuoteService
    let pricingService: PricingService

    beforeEach(() => {
        pricingService = new PricingService()
        service = new QuoteService(mockQuoteAdapter, pricingService)
        jest.clearAllMocks()
    })

    describe('createQuote', () => {
        it('persists computed systemPrice, riskBand and offers', async () => {
            jest.mocked(mockQuoteAdapter.insertEntry).mockResolvedValue(mockQuote)

            const result = await service.createQuote('uuid-user-42', {
                address: '123 Solar St',
                monthlyConsumptionKwh: 400,
                systemSizeKw: 5,
                downPayment: 1000
            })

            expect(jest.mocked(mockQuoteAdapter.insertEntry)).toHaveBeenCalledWith(
                expect.objectContaining({
                    systemPrice: 5 * 1200,
                    riskBand: 'A',
                    offers: expect.any(String)
                })
            )
            expect(result.offers).toHaveLength(3)
        })

        it('defaults downPayment to 0 when not provided', async () => {
            jest.mocked(mockQuoteAdapter.insertEntry).mockResolvedValue({ ...mockQuote, downPayment: 0 })

            await service.createQuote('uuid-user-42', {
                address: '123 Solar St',
                monthlyConsumptionKwh: 400,
                systemSizeKw: 5
            })

            expect(jest.mocked(mockQuoteAdapter.insertEntry)).toHaveBeenCalledWith(
                expect.objectContaining({ downPayment: 0 })
            )
        })
    })

    describe('getQuoteById', () => {
        it('returns the quote for the owner', async () => {
            jest.mocked(mockQuoteAdapter.findOne).mockResolvedValue(mockQuote)

            const result = await service.getQuoteById('uuid-quote-1', 'uuid-user-42', false)
            expect(result.id).toBe('uuid-quote-1')
            expect(result.offers).toBeDefined()
        })

        it('returns the quote for an admin regardless of ownership', async () => {
            jest.mocked(mockQuoteAdapter.findOne).mockResolvedValue(mockQuote)

            const result = await service.getQuoteById('uuid-quote-1', 'uuid-user-99', true)
            expect(result.id).toBe('uuid-quote-1')
        })

        it('throws ForbiddenException for a non-owner non-admin', async () => {
            jest.mocked(mockQuoteAdapter.findOne).mockResolvedValue(mockQuote)

            await expect(service.getQuoteById('uuid-quote-1', 'uuid-user-99', false)).rejects.toThrow(
                ForbiddenException
            )
        })

        it('throws NotFoundException when quote does not exist', async () => {
            jest.mocked(mockQuoteAdapter.findOne).mockResolvedValue(null)

            await expect(service.getQuoteById('uuid-quote-99', 'uuid-user-42', false)).rejects.toThrow(
                NotFoundException
            )
        })
    })

    describe('getUserQuotes', () => {
        it('returns quotes filtered by userId', async () => {
            jest.mocked(mockQuoteAdapter.findMany).mockResolvedValue([mockQuote])

            const result = await service.getUserQuotes('uuid-user-42')
            expect(jest.mocked(mockQuoteAdapter.findMany)).toHaveBeenCalledWith({ userId: 'uuid-user-42' })
            expect(result).toHaveLength(1)
        })
    })
})
