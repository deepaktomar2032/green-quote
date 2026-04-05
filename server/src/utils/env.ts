function required(key: string): string {
    const value: string | undefined = process.env[key]
    if (!value) throw new Error(`Missing required environment variable: ${key}`)
    return value
}

export const env = {
    get PORT(): number {
        return parseInt(required('PORT'))
    },
    get DATABASE_URL(): string {
        return required('DATABASE_URL')
    }
} as const
