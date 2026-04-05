import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, redirect } from 'react-router'

import { getAllQuotesAdmin } from '~/api'
import { type AdminQuoteSummary } from '~/types/api.types'
import { isAdmin, isLoggedIn } from '~/utils/auth'

import styles from './admin-quotes.module.scss'

export function clientLoader() {
    if (!isLoggedIn() || !isAdmin()) return redirect('/quotes')
    return null
}

type AdminQuote = AdminQuoteSummary

export default function AdminQuotes() {
    const { t } = useTranslation()
    const [quotes, setQuotes] = useState<AdminQuote[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    function fetchQuotes(q?: string) {
        setLoading(true)
        getAllQuotesAdmin(q || undefined)
            .then(setQuotes)
            .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchQuotes()
    }, [])

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    function handleSearchChange(value: string) {
        setSearch(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (value.length === 0) {
            fetchQuotes()
            return
        }
        if (value.length < 3) return
        debounceRef.current = setTimeout(() => fetchQuotes(value), 1000)
    }

    function bandClass(band: string) {
        if (band === 'A') return styles.bandA
        if (band === 'B') return styles.bandB
        return styles.bandC
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link to="/quotes" className={styles.backLink}>
                        {t('backToMyQuotes')}
                    </Link>
                    <h1 className={styles.title}>{t('adminTitle')}</h1>
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder={t('adminSearchPlaceholder')}
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className={styles.searchInput}
                    />
                    {search && (
                        <button type="button" onClick={() => handleSearchChange('')} className={styles.clearBtn}>
                            {t('clearButton')}
                        </button>
                    )}
                </div>

                {loading && <p className={styles.loadingMsg}>{t('loading')}</p>}
                {error && <p className={styles.errorMsg}>{error}</p>}
                {!loading && quotes.length === 0 && <p className={styles.emptyMsg}>{t('adminNoResults')}</p>}
                {quotes.length > 0 && (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th className={styles.thLeft}>{t('adminColDate')}</th>
                                    <th className={styles.thLeft}>{t('adminColUser')}</th>
                                    <th className={styles.thLeft}>{t('adminColAddress')}</th>
                                    <th className={styles.thRight}>{t('adminColSize')}</th>
                                    <th className={styles.thRight}>{t('adminColPrice')}</th>
                                    <th className={styles.thCenter}>{t('adminColBand')}</th>
                                    <th className={styles.th}></th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {quotes.map((q) => (
                                    <tr key={q.id} className={styles.tr}>
                                        <td className={styles.tdDate}>{new Date(q.createdAt).toLocaleDateString()}</td>
                                        <td className={styles.td}>
                                            <p className={styles.userName}>{q.user.fullName}</p>
                                            <p className={styles.userEmail}>{q.user.email}</p>
                                        </td>
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
