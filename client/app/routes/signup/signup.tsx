import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, redirect, useNavigate } from 'react-router'

import { signup } from '~/api'
import { isLoggedIn } from '~/utils/auth'

import styles from './signup.module.scss'

export function clientLoader() {
    if (isLoggedIn()) return redirect('/quotes')
    return null
}

export default function Signup() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signup({ fullName, email, password })
            await navigate('/login')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('signupTitle')}</h1>
                <form
                    onSubmit={(e) => {
                        void handleSubmit(e)
                    }}
                    className={styles.form}
                >
                    <div>
                        <label className={styles.label}>{t('signupFullName')}</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label className={styles.label}>{t('signupEmail')}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label className={styles.label}>
                            {t('signupPassword')} <span className={styles.passwordHint}>{t('signupPasswordHint')}</span>
                        </label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" disabled={loading} className={styles.btn}>
                        {loading ? t('signupSubmitLoading') : t('signupSubmit')}
                    </button>
                </form>
                <p className={styles.footer}>
                    {t('signupFooter')}{' '}
                    <Link to="/login" className={styles.link}>
                        {t('signupSignIn')}
                    </Link>
                </p>
            </div>
        </div>
    )
}
