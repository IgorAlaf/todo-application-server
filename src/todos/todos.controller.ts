import {
	ApiTags,
	ApiResponse,
	ApiQuery,
	ApiParam,
	ApiBearerAuth,
	ApiOperation,
	ApiNotFoundResponse
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
import {
	ExceptionBadRequest,
	ExceptionNotFounded,
	ExceptionServerInternal,
	ExceptionUnauthorized
} from 'src/types/indes'
import { ResTodoDto } from './dto/resTodo.dto'
import { SignInDto } from 'src/auth/dto/signin.dto'

@ApiResponse({ status: 401, type: ExceptionUnauthorized })
@ApiResponse({ status: 400, type: ExceptionBadRequest })
@ApiResponse({ status: 500, type: ExceptionServerInternal })
@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}
	@HttpCode(201)
	@Post('create')
	@ApiOperation({ summary: 'Create a new task' })
	@ApiResponse({ status: 201, type: ResTodoDto })
	create(@Body() todoDto: TodoDto, @Req() req) {
		return this.todosService.create(todoDto, req.user.id)
	}
	@ApiResponse({ status: 200, type: ResTodoDto })
	@ApiResponse({ status: 404, type: ExceptionNotFounded })
	@ApiOperation({ summary: 'Edit existing task by id' })
	@ApiParam({ name: 'id', example: 1 })
	@Patch('edit/:id')
	update(@Body() todoDto: TodoDto, @Req() req: Request) {
		return this.todosService.update(todoDto, req.params.id as unknown as number)
	}
	@HttpCode(204)
	@ApiResponse({ status: 404, type: ExceptionNotFounded })
	@ApiOperation({ summary: 'Delete existsing task by id' })
	@ApiResponse({ status: 204, type: '' })
	@ApiParam({ name: 'id', example: 1 })
	@Delete('delete/:id')
	delete(@Req() req: Request) {
		this.todosService.delete(req.params.id as unknown as number)
		return
	}

	@ApiResponse({ status: 200, type: [ResTodoDto] })
	@ApiOperation({ summary: 'Get user tasks' })
	@Get('')
	todos(@Req() req) {
		return this.todosService.getAll(req.user.id)
	}
	@Get('search')
	@ApiQuery({ name: 'title', example: 'dinner', required: true })
	@ApiOperation({ summary: 'Get tasks by title' })
	@ApiResponse({ status: 200, type: [ResTodoDto] })
	search(@Req() req) {
		return this.todosService.search(req.user.id, req.query.title as string)
	}
	@ApiResponse({ status: 200, type: ResTodoDto })
	@ApiOperation({ summary: 'Get task by id' })
	@ApiResponse({ status: 404, type: ExceptionNotFounded })
	@ApiParam({ name: 'id', example: 1 })
	@Get('/:id')
	todo(@Req() req: Request) {
		return this.todosService.getOne(req.params.id as unknown as number)
	}
}
