import { QuoteOffer } from 'src/quote/quote.types'

import { PRICING_CONFIG } from './pricing.config'
import { PricingService } from './pricing.service'

describe('PricingService', () => {
    let service: PricingService

    beforeEach(() => {
        service = new PricingService()
    })

    describe('computeSystemPrice', () => {
        it('multiplies systemSizeKw by pricePerKw from config', () => {
            expect(service.computeSystemPrice(5)).toBe(5 * PRICING_CONFIG.pricePerKw)
        })

        it('returns 0 for 0 kw', () => {
            expect(service.computeSystemPrice(0)).toBe(0)
        })
    })

    describe('computeRiskBand', () => {
        it('returns A when kwh >= 400 and kw <= 6', () => {
            expect(service.computeRiskBand(400, 6)).toBe('A')
            expect(service.computeRiskBand(500, 4)).toBe('A')
        })

        it('returns B when kwh >= 400 but kw > 6', () => {
            expect(service.computeRiskBand(400, 7)).toBe('B')
        })

        it('returns B when kwh >= 250 and kw <= 6 but kwh < 400', () => {
            expect(service.computeRiskBand(250, 5)).toBe('B')
            expect(service.computeRiskBand(399, 6)).toBe('B')
        })

        it('returns C when kwh < 250', () => {
            expect(service.computeRiskBand(249, 5)).toBe('C')
            expect(service.computeRiskBand(100, 10)).toBe('C')
        })
    })

    describe('computeOffers', () => {
        it('returns one offer per term in config', () => {
            const offers: QuoteOffer[] = service.computeOffers(10000, 'A')
            expect(offers).toHaveLength(PRICING_CONFIG.offerTermsYears.length)
            expect(offers.map((offer) => offer.termYears)).toEqual([...PRICING_CONFIG.offerTermsYears])
        })

        it('uses correct APR for each band', () => {
            expect(service.computeOffers(10000, 'A')[0].apr).toBe(PRICING_CONFIG.bands.A.apr)
            expect(service.computeOffers(10000, 'B')[0].apr).toBe(PRICING_CONFIG.bands.B.apr)
            expect(service.computeOffers(10000, 'C')[0].apr).toBe(PRICING_CONFIG.bands.C.apr)
        })

        it('monthly payment is positive and decreases for longer terms with same principal', () => {
            const offers: QuoteOffer[] = service.computeOffers(10000, 'B')
            expect(offers[0].monthlyPayment).toBeGreaterThan(offers[1].monthlyPayment)
            expect(offers[1].monthlyPayment).toBeGreaterThan(offers[2].monthlyPayment)
        })

        it('sets principalUsed to the passed principal', () => {
            const offers: QuoteOffer[] = service.computeOffers(15000, 'C')
            offers.forEach((offer) => expect(offer.principalUsed).toBe(15000))
        })
    })
})
