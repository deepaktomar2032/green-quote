const TOKEN_KEY: string = 'access_token'

const isBrowser: boolean = typeof window !== 'undefined'

export type JwtPayload = {
    sub: number
    email: string
    fullName: string
    isAdmin: boolean
    iat: number
    exp: number
}

function setCookie(value: string, days = 7): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function getCookie(): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + TOKEN_KEY + '=([^;]*)'))
    return match ? decodeURIComponent(match[2]) : null
}

export function setToken(token: string): void {
    if (isBrowser) setCookie(token)
}

export function getToken(): string | null {
    if (!isBrowser) return null
    return getCookie()
}

export function getPayload(): JwtPayload | null {
    const token = getToken()
    if (!token) return null
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(base64)) as JwtPayload
    } catch {
        return null
    }
}

export function isLoggedIn(): boolean {
    const payload = getPayload()
    if (!payload) return false
    return payload.exp * 1000 > Date.now()
}

export function isAdmin(): boolean {
    return getPayload()?.isAdmin === true
}
