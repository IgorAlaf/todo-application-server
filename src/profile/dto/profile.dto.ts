import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'
export class ProfileDto {
	@IsString()
	@MaxLength(50)
	@ApiProperty({
		description: 'Field with user name',
		default: '-',
		example: 'Igor',
		maxLength: 50
	})
	name: string
	@ApiProperty({
		description: 'Field with user date of birth',
		default: '-',
		example: '2023-09-07'
	})
	@IsString()
	dateOfBirth: Date

	@ApiProperty({
		description: 'Field with user surname',
		default: '-',
		example: 'Bulkov',
		maxLength: 50
	})
	@IsString()
	@MaxLength(50)
	surname: string
	@ApiProperty({
		description: 'Field with user patronymic',
		default: '-',
		example: 'Aleksandrovich',
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
		example: '+88005553535',
		maxLength: 50
	})
	@MaxLength(50)
	@IsString()
	phone: string
}
