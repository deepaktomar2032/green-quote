import { httpClient } from './http-client'

export async function login(data: { email: string; password: string }): Promise<{ access_token: string }> {
    try {
        return await httpClient.post<{ access_token: string }>('/login', data)
    } catch (error) {
        throw error instanceof Error ? error : new Error('Login failed')
    }
}

export async function signup(data: {
    fullName: string
    email: string
    password: string
}): Promise<{ id: number; email: string }> {
    try {
        return await httpClient.post<{ id: number; email: string }>('/signup', data)
    } catch (error) {
        throw error instanceof Error ? error : new Error('Signup failed')
    }
}
