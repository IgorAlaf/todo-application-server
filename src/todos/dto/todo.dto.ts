import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator'
export class TodoDto {
	@ApiProperty({
		description: 'Todo title',
		example: 'Make dinner',
		default: 'none',
		maxLength: 50,
		minLength: 1
	})
	@IsString()
	@MaxLength(50)
	@MinLength(1)
	title: string
	@ApiProperty({
		description: 'Todo description',
		example: 'Cook tasty food',
		default: '1',
		maxLength: 200
	})
	@IsString()
	@MaxLength(200)
	description: string
	@ApiProperty({
		description: 'Date of completion',
		default: '00-00-0000',
		example: '2023-09-13'
	})
	@IsString()
	date: string
	@ApiProperty({
		description: 'Time of completion',
		example: '21:30',
		default: '00:00'
	})
	@IsString()
	time: string
	@ApiProperty({
		description: 'Check of todo',
		example: true,
		default: false
	})
	@IsBoolean()
	checked: boolean
}
