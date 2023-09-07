import { ApiProperty } from '@nestjs/swagger'
import { ProfileDto } from './profile.dto'
import { IsNumber, Min, IsString } from 'class-validator'
export class ResProfileDto extends ProfileDto {
	@ApiProperty({
		description: 'Profile id',
		default: 1,
		example: 1,
		minimum: 1
	})
	@IsNumber()
	@Min(1)
	id: number
	@ApiProperty({
		description: 'Field with user avatar path',
		default: 'standart.png',
		example: 'my-icon.jpg',
		pattern: '/.(jpg|jpeg|png|gif)$/'
	})
	@IsString()
	avatar: string
	@ApiProperty({
		description: 'Field with user id',
		default: 1,
		example: 1,
		minimum: 1
	})
	@IsNumber()
	@Min(1)
	userId: number
}
