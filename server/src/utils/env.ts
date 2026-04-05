function required(key: string): string {
    const value: string | undefined = process.env[key]
    if (!value) throw new Error(`Missing required environment variable: ${key}`)
    return value
}

export const env = {
    get PORT(): number {
        return parseInt(required('PORT'), 10)
    },
    get DATABASE_URL(): string {
        return required('DATABASE_URL')
    },
    get JWT_SECRET(): string {
        return required('JWT_SECRET')
    },
    get JWT_EXPIRES_IN(): string {
        return required('JWT_EXPIRES_IN')
    },
    get OTEL_SERVICE_NAME(): string {
        return required('OTEL_SERVICE_NAME')
    },
    get OTEL_EXPORTER_OTLP_ENDPOINT(): string {
        return required('OTEL_EXPORTER_OTLP_ENDPOINT')
    }
} as const

export const SALT_ROUNDS: number = 10
