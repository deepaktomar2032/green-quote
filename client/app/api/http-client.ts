import { getToken } from '~/utils/auth'
import { env } from '~/utils/env'

class HttpClient {
    constructor(private readonly baseUrl: string) {}

    async get<T>(path: string): Promise<T> {
        return this.request<T>(path)
    }

    async post<T>(path: string, body: unknown): Promise<T> {
        return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) })
    }

    private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const token = getToken()
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers })
        if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { message?: string }
            throw new Error(body.message ?? res.statusText)
        }
        return res.json() as Promise<T>
    }
}

export const httpClient = new HttpClient(env.API_BASE_URL)
