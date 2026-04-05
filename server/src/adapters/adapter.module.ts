import { Module } from '@nestjs/common'

import { DatabaseModule } from 'src/database/database.module'

import { QuoteAdapter } from './quote.adapter'
import { UserAdapter } from './user.adapter'

@Module({
    imports: [DatabaseModule],
    providers: [UserAdapter, QuoteAdapter],
    exports: [UserAdapter, QuoteAdapter]
})
export class AdapterModule {}
