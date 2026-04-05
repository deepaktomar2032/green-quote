import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
    @ApiProperty({ example: 'admin@test.com', description: 'Registered email address' })
    @IsEmail()
    email!: string

    @ApiProperty({ example: 'testadmin', description: 'Account password' })
    @IsString()
    @IsNotEmpty()
    password!: string
}
