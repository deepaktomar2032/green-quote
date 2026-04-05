function required(key: string): string {
    const value = import.meta.env[key] as string | undefined
    if (!value) throw new Error(`Missing required environment variable: ${key}`)
    return value
}

export const env = {
    get API_BASE_URL(): string {
        return required('VITE_API_BASE_URL')
    }
} as const
