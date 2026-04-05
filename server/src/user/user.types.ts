import { User } from '@prisma/client'

export type PublicUser = Omit<User, 'password'>

export type AuthTokenResponse = {
    access_token: string
}
