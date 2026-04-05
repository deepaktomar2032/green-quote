import type { Quote } from '@prisma/client'

export type QuoteOffer = {
    termYears: number
    apr: number
    principalUsed: number
    monthlyPayment: number
}

export type QuoteResult = {
    id: string
    userId: string
    address: string
    monthlyConsumptionKwh: number
    systemSizeKw: number
    downPayment: number
    systemPrice: number
    riskBand: string
    offers: QuoteOffer[]
    createdAt: Date
    updatedAt: Date
}

export type QuoteWithUser = Quote & { user: { fullName: string; email: string } }
