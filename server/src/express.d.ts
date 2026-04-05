import type { JwtPayload } from 'src/auth/jwt.types'

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}
