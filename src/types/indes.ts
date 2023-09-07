import { ApiProperty } from '@nestjs/swagger'
export interface ITokens {
	accessToken: string
	refreshToken: string
}

export class ExceptionUnauthorized {
	@ApiProperty({
		description: 'Error status code',
		default: 401,
		example: 401
	})
	statusCode: number
	@ApiProperty({
		description: 'Error message',
		default: 'Unauthorized',
		example: 'Unauthorized'
	})
	message: string
}
export class ExceptionBadRequest {
	@ApiProperty({
		description: 'Error status code',
		default: 400,
		example: 400
	})
	statusCode: number
	@ApiProperty({
		description: 'Error message',
		default: 'Bad Request',
		example: 'Bad Request'
	})
	message: string
}
