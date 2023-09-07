import { ApiProperty } from '@nestjs/swagger'
import { TodoDto } from './todo.dto'
import { IsNumber } from 'class-validator'
export class ResTodoDto extends TodoDto {
	@ApiProperty({ description: 'Todo id', default: 1, example: 1, minimum: 1 })
	@IsNumber()
	id: number
	@ApiProperty({ description: 'User id', default: 1, example: 1, minimum: 1 })
	@IsNumber()
	userId: number
}
