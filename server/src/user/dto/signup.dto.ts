import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SignupDto {
    @ApiProperty({ example: 'Jane Doe', description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty()
    fullName!: string

    @ApiProperty({ example: 'jane@example.com', description: 'Email address (must be unique)' })
    @IsEmail()
    email!: string

    @ApiProperty({ example: 'securepass123', description: 'Password (minimum 8 characters)', minLength: 8 })
    @IsString()
    @MinLength(8)
    password!: string
}
