import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
export class SignInDto {
	@IsEmail()
	@MaxLength(50)
	@ApiProperty({
		description: 'User email',
		default: '',
		example: 'loowodi@gmail.com',
		maxLength: 50,
		pattern:
			'^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|.(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$'
	})
	email: string
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
}
