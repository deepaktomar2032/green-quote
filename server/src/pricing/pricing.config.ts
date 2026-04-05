export const PRICING_CONFIG = {
    pricePerKw: 1200,
    bands: {
        A: { minKwh: 400, maxKw: 6, apr: 0.069 },
        B: { minKwh: 250, apr: 0.089 },
        C: { apr: 0.119 }
    },
    offerTermsYears: [5, 10, 15]
} as const

export type RiskBand = 'A' | 'B' | 'C'
