import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const SALT_ROUNDS: number = 10

async function main() {
    const hashedPassword: string = await bcrypt.hash('testadmin', SALT_ROUNDS)

    await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: { isAdmin: true },
        create: {
            fullName: 'Admin',
            email: 'admin@test.com',
            password: hashedPassword,
            isAdmin: true
        }
    })

    console.log('Seed complete: admin@test.com created')
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
