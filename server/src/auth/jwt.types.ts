export type JwtPayload = {
    sub: string
    email: string
    fullName: string
    isAdmin: boolean
    iat?: number
    exp?: number
}
