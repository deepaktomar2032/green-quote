import { Module } from '@nestjs/common'

import { AdapterModule } from 'src/adapters/adapter.module'
import { PricingModule } from 'src/pricing/pricing.module'

import { QuoteController } from './controllers/quote.controller'
import { QuoteService } from './services/quote.service'

@Module({
    imports: [AdapterModule, PricingModule],
    controllers: [QuoteController],
    providers: [QuoteService]
})
export class QuoteModule {}
