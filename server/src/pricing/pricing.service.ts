import { Injectable } from '@nestjs/common'

import type { QuoteOffer } from 'src/quote/quote.types'

import { PRICING_CONFIG, RiskBand } from './pricing.config'

@Injectable()
export class PricingService {
    computeSystemPrice(systemSizeKw: number): number {
        return systemSizeKw * PRICING_CONFIG.pricePerKw
    }

    computeRiskBand(monthlyConsumptionKwh: number, systemSizeKw: number): RiskBand {
        const { A, B } = PRICING_CONFIG.bands
        if (monthlyConsumptionKwh >= A.minKwh && systemSizeKw <= A.maxKw) return 'A'
        if (monthlyConsumptionKwh >= B.minKwh) return 'B'
        return 'C'
    }

    computeOffers(principal: number, band: RiskBand): QuoteOffer[] {
        const apr = PRICING_CONFIG.bands[band].apr

        return PRICING_CONFIG.offerTermsYears.map((termYears) => {
            const numPayments: number = termYears * 12
            const monthlyRate: number = apr / 12
            const monthlyPayment: number =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1)

            return {
                termYears,
                apr,
                principalUsed: principal,
                monthlyPayment: Math.round(monthlyPayment * 100) / 100
            }
        })
    }
}
