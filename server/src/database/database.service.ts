import { PrismaService } from 'src/prisma.service'

export type Delegate<T> = {
    findMany(args?: unknown): Promise<T[]>
    findUnique(args?: unknown): Promise<T | null>
    create(args: unknown): Promise<T>
}

export class DatabaseService<T> {
    constructor(
        protected readonly delegate: Delegate<T>,
        protected readonly prisma: PrismaService,
        protected readonly getDelegateFromTransaction: (client: PrismaService) => Delegate<T>
    ) {}

    async findOne(where: Record<string, unknown>): Promise<T | null> {
        return this.delegate.findUnique({ where })
    }

    async findMany(where?: Record<string, unknown>): Promise<T[]> {
        return this.delegate.findMany({ where })
    }

    async findEntries(args?: unknown): Promise<T[]> {
        return this.delegate.findMany(args)
    }

    async insertEntry(data: Partial<T>): Promise<T> {
        return this.delegate.create({ data })
    }
}
