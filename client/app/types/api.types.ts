export type QuoteOffer = {
    termYears: number
    apr: number
    principalUsed: number
    monthlyPayment: number
}

export type Quote = {
    id: string
    userId: string
    address: string
    monthlyConsumptionKwh: number
    systemSizeKw: number
    downPayment: number
    systemPrice: number
    riskBand: string
    offers: QuoteOffer[]
    createdAt: string
    updatedAt: string
}

export type QuoteSummary = {
    id: string
    address: string
    systemSizeKw: number
    systemPrice: number
    riskBand: string
    offers: string
    createdAt: string
    user?: { fullName: string; email: string }
}

export type AdminQuoteSummary = QuoteSummary & { user: { fullName: string; email: string } }

export type CreateQuoteInput = {
    address: string
    monthlyConsumptionKwh: number
    systemSizeKw: number
    downPayment?: number
}
