import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
export class PassDto {
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@ApiProperty({
		description: 'User password',
		default: '123123',
		example: 'M12asdf134@@',
		minLength: 6,
		maxLength: 50
	})
	password: string
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@ApiProperty({
		description: 'User password',
		default: '111111',
		example: 'qwerty123123qwerty',
		minLength: 6,
		maxLength: 50
	})
	newPassword: string
}
