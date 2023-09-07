import {
	ApiTags,
	ApiResponse,
	ApiQuery,
	ApiParam,
	ApiBearerAuth
} from '@nestjs/swagger'
import {
	Controller,
	UseGuards,
	Post,
	HttpCode,
	Body,
	Patch,
	Delete,
	Req,
	Get
} from '@nestjs/common'
import { TodosService } from './todos.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { TodoDto } from './dto/todo.dto'
import { Request } from 'express'
import { ExceptionBadRequest, ExceptionUnauthorized } from 'src/types/indes'
import { ResTodoDto } from './dto/resTodo.dto'

@ApiResponse({ status: 401, type: ExceptionUnauthorized })
@ApiResponse({ status: 400, type: ExceptionBadRequest })
@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Post('create')
	@ApiResponse({ status: 201, type: ResTodoDto })
	@HttpCode(201)
	create(@Body() todoDto: TodoDto, @Req() req) {
		return this.todosService.create(todoDto, req.user.id)
	}
	@ApiResponse({ status: 200, type: ResTodoDto })
	@ApiParam({ name: 'id', example: 1 })
	@Patch('edit/:id')
	update(@Body() todoDto: TodoDto, @Req() req: Request) {
		return this.todosService.update(todoDto, req.params.id as unknown as number)
	}
	@ApiResponse({ status: 200, type: '' })
	@ApiParam({ name: 'id', example: 1 })
	@Delete('delete/:id')
	delete(@Req() req: Request) {
		this.todosService.delete(req.params.id as unknown as number)
		return
	}
	@ApiResponse({ status: 200, type: [ResTodoDto] })
	@Get('')
	todos(@Req() req) {
		return this.todosService.getAll(req.user.id)
	}
	@Get('search')
	@ApiResponse({ status: 200, type: [ResTodoDto] })
	@ApiQuery({ name: 'line', example: 'dinner' })
	search(@Req() req) {
		return this.todosService.search(req.user.id, req.query.line as string)
	}
	@ApiResponse({ status: 200, type: ResTodoDto })
	@ApiParam({ name: 'id', example: 1 })
	@Get('/:id')
	todo(@Req() req: Request) {
		return this.todosService.getOne(req.params.id as unknown as number)
	}
}
