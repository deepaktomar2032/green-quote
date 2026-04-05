import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, redirect, useNavigate } from 'react-router'

import { login } from '~/api'
import { isLoggedIn, setToken } from '~/utils/auth'

import styles from './login.module.scss'

export function clientLoader() {
    if (isLoggedIn()) return redirect('/quotes')
    return null
}

export default function Login() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await login({ email, password })
            setToken(res.access_token)
            await navigate('/quotes')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('loginTitle')}</h1>
                <form
                    onSubmit={(e) => {
                        void handleSubmit(e)
                    }}
                    className={styles.form}
                >
                    <div>
                        <label className={styles.label}>{t('loginEmail')}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label className={styles.label}>{t('loginPassword')}</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" disabled={loading} className={styles.btn}>
                        {loading ? t('loginSubmitLoading') : t('loginSubmit')}
                    </button>
                </form>
                <p className={styles.footer}>
                    {t('loginFooter')}{' '}
                    <Link to="/signup" className={styles.link}>
                        {t('loginSignUp')}
                    </Link>
                </p>
            </div>
        </div>
    )
}
