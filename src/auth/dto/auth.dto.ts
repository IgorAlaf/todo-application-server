import { ApiProperty } from '@nestjs/swagger'
import { ITokens } from 'src/types/indes'
import {
	IsString,
	IsEmail,
	IsNumber,
	MaxLength,
	Min,
	MinLength
} from 'class-validator'
export class TokensDto {
	@IsString()
	@ApiProperty({
		description: 'Access token(Bearer)',
		default: '',
		example: 'asdfglaskfjhash2ojh34pohjfspadjf'
	})
	accessToken: string
	@ApiProperty({
		description: 'Refresh token,default',
		default: '',
		example: 'asdfglaskfjhash2ojh34pohjfspadjf'
	})
	@IsString()
	refreshToken: string
}
export class UserDto {
	@IsEmail()
	@MaxLength(50)
	@MinLength(6)
	@ApiProperty({
		description: 'User email',
		default: '',
		example: 'loowodi@gmail.com',
		minLength: 6,
		maxLength: 50,
		pattern:
			'^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|.(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$'
	})
	email: string
	@IsNumber()
	@Min(1)
	@ApiProperty({ description: 'User id', default: 1, example: 1, minimum: 1 })
	id: number
}

export class AuthDto extends TokensDto {
	@ApiProperty({ type: UserDto })
	user: { email: string; id: number }
}
