import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, redirect, useNavigate } from 'react-router'

import { createQuote } from '~/api'
import { getPayload, isLoggedIn } from '~/utils/auth'

import styles from './quotes-new.module.scss'

export function clientLoader() {
    if (!isLoggedIn()) return redirect('/login')
    return null
}

export default function NewQuote() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const payload = getPayload()

    const [address, setAddress] = useState('')
    const [monthlyConsumptionKwh, setMonthlyConsumptionKwh] = useState('')
    const [systemSizeKw, setSystemSizeKw] = useState('')
    const [downPayment, setDownPayment] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const quote = await createQuote({
                address,
                monthlyConsumptionKwh: parseFloat(monthlyConsumptionKwh),
                systemSizeKw: parseFloat(systemSizeKw),
                ...(downPayment ? { downPayment: parseFloat(downPayment) } : {})
            })
            await navigate(`/quotes/${quote.id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create quote')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link to="/quotes" className={styles.backLink}>
                    {t('backToMyQuotes')}
                </Link>
                <h1 className={styles.title}>{t('newQuoteTitle')}</h1>
            </header>
            <main className={styles.main}>
                <form
                    onSubmit={(e) => {
                        void handleSubmit(e)
                    }}
                    className={styles.form}
                >
                    <div className={styles.grid2}>
                        <div>
                            <label className={styles.label}>{t('newQuoteFullName')}</label>
                            <input
                                type="text"
                                readOnly
                                value={payload?.fullName ?? ''}
                                className={styles.inputReadonly}
                            />
                        </div>
                        <div>
                            <label className={styles.label}>{t('newQuoteEmail')}</label>
                            <input type="text" readOnly value={payload?.email ?? ''} className={styles.inputReadonly} />
                        </div>
                    </div>
                    <div>
                        <label className={styles.label}>{t('newQuoteAddress')}</label>
                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.grid2}>
                        <div>
                            <label className={styles.label}>{t('newQuoteConsumption')}</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="any"
                                value={monthlyConsumptionKwh}
                                onChange={(e) => setMonthlyConsumptionKwh(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div>
                            <label className={styles.label}>{t('newQuoteSize')}</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="any"
                                value={systemSizeKw}
                                onChange={(e) => setSystemSizeKw(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={styles.label}>
                            {t('newQuoteDownPayment')} <span className={styles.optionalHint}>{t('optional')}</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="any"
                            value={downPayment}
                            onChange={(e) => setDownPayment(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" disabled={loading} className={styles.btn}>
                        {loading ? t('newQuoteSubmitLoading') : t('newQuoteSubmit')}
                    </button>
                </form>
            </main>
        </div>
    )
}
