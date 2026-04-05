import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class CreateQuoteDto {
    @ApiProperty({ example: '12 Solar Street, Berlin', description: 'Installation address for the solar system' })
    @IsString()
    address!: string

    @ApiProperty({ example: 400, description: 'Average monthly electricity consumption in kWh', minimum: 0 })
    @IsNumber()
    @Min(0)
    monthlyConsumptionKwh!: number

    @ApiProperty({ example: 5, description: 'Desired solar system size in kilowatts', minimum: 0 })
    @IsNumber()
    @Min(0)
    systemSizeKw!: number

    @ApiPropertyOptional({ example: 1000, description: 'Optional upfront down payment in EUR', minimum: 0 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    downPayment?: number
}
