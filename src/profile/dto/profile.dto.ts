import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, MaxLength, MinLength } from 'class-validator'
export class ProfileDto {
	@IsString()
	@MaxLength(50)
	@MinLength(2)
	@ApiProperty({
		description: 'Field with user name',
		default: '-',
		example: 'Igor',
		minLength: 2,
		maxLength: 50
	})
	name: string
	@ApiProperty({
		description: 'Field with user date of birth',
		default: '-',
		example: '2023-09-07'
	})
	@IsString()
	dateOfBirth: string
	@MinLength(2)
	@ApiProperty({
		description: 'Field with user surname',
		default: '-',
		example: 'Bulkov',
		minLength: 2,
		maxLength: 50
	})
	@IsString()
	@MaxLength(50)
	surname: string
	@MinLength(2)
	@ApiProperty({
		description: 'Field with user patronymic',
		default: '-',
		example: 'Aleksandrovich',
		minLength: 2,
		maxLength: 50
	})
	@IsString()
	@MaxLength(50)
	patronymic: string

	@ApiProperty({
		description: 'Field with user sex',
		default: '-',
		example: 'm'
	})
	@IsString()
	sex: string
	@ApiProperty({
		description: 'Field with user phone',
		default: '-',
		example: '+7 (914) 172-72-67',
		minLength: 18,
		maxLength: 18
	})
	@Length(18)
	@IsString()
	phone: string
}
