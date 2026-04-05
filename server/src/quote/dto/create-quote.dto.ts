import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class CreateQuoteDto {
    @IsString()
    address!: string

    @IsNumber()
    @Min(0)
    monthlyConsumptionKwh!: number

    @IsNumber()
    @Min(0)
    systemSizeKw!: number

    @IsNumber()
    @Min(0)
    @IsOptional()
    downPayment?: number
}
