import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, redirect, useParams } from 'react-router'

import { getQuoteById } from '~/api'
import { type Quote } from '~/types/api.types'
import { isLoggedIn } from '~/utils/auth'

import styles from './quotes-id.module.scss'

export function clientLoader() {
    if (!isLoggedIn()) return redirect('/login')
    return null
}

export default function QuoteDetail() {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const [quote, setQuote] = useState<Quote | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return
        getQuoteById(id)
            .then(setQuote)
            .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load'))
            .finally(() => setLoading(false))
    }, [id])

    function bandClass(band: string) {
        if (band === 'A') return styles.bandA
        if (band === 'B') return styles.bandB
        return styles.bandC
    }

    if (loading) return <div className={styles.loading}>{t('loading')}</div>

    const ERROR_KEYS: Record<string, [string, string]> = {
        'Quote not found': ['quoteDetailErrNotFound', 'quoteDetailErrNotFoundDesc'],
        'Access denied': ['quoteDetailErrAccessDenied', 'quoteDetailErrAccessDeniedDesc']
    }

    if (error || !quote) {
        const [titleKey, descKey] = ERROR_KEYS[error] ?? ['quoteDetailErrGeneric', 'quoteDetailErrGenericDesc']
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <Link to="/quotes" className={styles.backLink}>
                        {t('backToMyQuotes')}
                    </Link>
                </header>
                <div className={styles.errorScreen}>
                    <div>
                        <p className={styles.errorTitle}>{t(titleKey)}</p>
                        <p className={styles.errorDesc}>{t(descKey)}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link to="/quotes" className={styles.backLink}>
                    {t('backToMyQuotes')}
                </Link>
                <h1 className={styles.title}>{t('quoteDetailTitle')}</h1>
            </header>
            <main className={styles.main}>
                <div className={styles.detailGrid}>
                    <div>
                        <p className={styles.fieldLabel}>{t('quoteDetailAddress')}</p>
                        <p className={styles.fieldValue}>{quote.address}</p>
                    </div>
                    <div>
                        <p className={styles.fieldLabel}>{t('quoteDetailSystemSize')}</p>
                        <p className={styles.fieldValue}>{quote.systemSizeKw} kW</p>
                    </div>
                    <div>
                        <p className={styles.fieldLabel}>{t('quoteDetailSystemPrice')}</p>
                        <p className={styles.price}>€{quote.systemPrice.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className={styles.fieldLabel}>{t('quoteDetailRiskBand')}</p>
                        <div className={styles.bandRow}>
                            <span className={bandClass(quote.riskBand)}>{quote.riskBand}</span>
                            <span className={styles.bandDesc}>{t(`quoteDetailBand${quote.riskBand}`)}</span>
                        </div>
                    </div>
                    <div>
                        <p className={styles.fieldLabel}>{t('quoteDetailDownPayment')}</p>
                        <p className={styles.fieldValue}>€{quote.downPayment.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className={styles.fieldLabel}>{t('quoteDetailConsumption')}</p>
                        <p className={styles.fieldValue}>{quote.monthlyConsumptionKwh} kWh</p>
                    </div>
                </div>

                <div className={styles.offersCard}>
                    <div className={styles.offersHeader}>
                        <h2 className={styles.offersTitle}>{t('quoteDetailOffersTitle')}</h2>
                    </div>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th className={styles.thLeft}>{t('quoteDetailTerm')}</th>
                                <th className={styles.thRight}>{t('quoteDetailApr')}</th>
                                <th className={styles.thRight}>{t('quoteDetailPrincipal')}</th>
                                <th className={styles.thRight}>{t('quoteDetailMonthlyPayment')}</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {quote.offers.map((offer) => (
                                <tr key={offer.termYears} className={styles.tr}>
                                    <td className={styles.td}>{t('quoteDetailYears', { count: offer.termYears })}</td>
                                    <td className={styles.tdRight}>{(offer.apr * 100).toFixed(1)}%</td>
                                    <td className={styles.tdRight}>€{offer.principalUsed.toLocaleString()}</td>
                                    <td className={styles.tdPayment}>€{offer.monthlyPayment.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}
