import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, redirect, useNavigate } from 'react-router'

import { getMyQuotes } from '~/api'
import { type QuoteSummary } from '~/types/api.types'
import { clearToken, getPayload, isLoggedIn } from '~/utils/auth'

import styles from './quotes.module.scss'

export function clientLoader() {
    if (!isLoggedIn()) return redirect('/login')
    return null
}

export default function Quotes() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [quotes, setQuotes] = useState<QuoteSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const payload = getPayload()

    useEffect(() => {
        void getMyQuotes()
            .then(setQuotes)
            .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load'))
            .finally(() => setLoading(false))
    }, [])

    function handleLogout() {
        clearToken()
        void navigate('/login')
    }

    function bandClass(band: string) {
        if (band === 'A') return styles.bandA
        if (band === 'B') return styles.bandB
        return styles.bandC
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.logo}>{t('appName')}</h1>
                <div className={styles.headerRight}>
                    <span className={styles.userEmail}>{payload?.email}</span>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        {t('signOut')}
                    </button>
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.toolbar}>
                    <h2 className={styles.pageTitle}>{t('quotesTitle')}</h2>
                    <div className={styles.actions}>
                        {payload?.isAdmin && (
                            <Link to="/admin/quotes" className={styles.btnPrimary}>
                                {t('quotesViewAll')}
                            </Link>
                        )}
                        <Link to="/quotes/new" className={styles.btnPrimary}>
                            {t('quotesNew')}
                        </Link>
                    </div>
                </div>
                {loading && <p className={styles.loadingMsg}>{t('loading')}</p>}
                {error && <p className={styles.errorMsg}>{error}</p>}
                {!loading && quotes.length === 0 && <p className={styles.emptyMsg}>{t('quotesEmpty')}</p>}
                {quotes.length > 0 && (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th className={styles.thLeft}>{t('quotesColDate')}</th>
                                    <th className={styles.thLeft}>{t('quotesColAddress')}</th>
                                    <th className={styles.thRight}>{t('quotesColSize')}</th>
                                    <th className={styles.thRight}>{t('quotesColPrice')}</th>
                                    <th className={styles.thCenter}>{t('quotesColBand')}</th>
                                    <th className={styles.th}></th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {quotes.map((q) => (
                                    <tr key={q.id} className={styles.tr}>
                                        <td className={styles.tdDate}>{new Date(q.createdAt).toLocaleDateString()}</td>
                                        <td className={styles.td}>{q.address}</td>
                                        <td className={styles.tdRight}>{q.systemSizeKw}</td>
                                        <td className={styles.tdRight}>{q.systemPrice.toLocaleString()}</td>
                                        <td className={styles.tdCenter}>
                                            <span className={bandClass(q.riskBand)}>{q.riskBand}</span>
                                        </td>
                                        <td className={styles.tdRight}>
                                            <Link to={`/quotes/${q.id}`} className={styles.viewLink}>
                                                {t('view')}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}
