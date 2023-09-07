import { Injectable, BadRequestException } from '@nestjs/common'
import { TodoDto } from './dto/todo.dto'
import { Todos } from './entities/todos.entity'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class TodosService {
	constructor(
		@InjectRepository(Todos) private todoRepository: Repository<Todos>,
		private configService: ConfigService
	) {}
	async create({ name, description, date, time }: TodoDto, userId: number) {
		const todo = await this.todoRepository.create({
			name,
			description,
			date,
			time,
			userId
		})
		await this.todoRepository.save(todo)
		return todo
	}
	async update({ name, description, date, time }: TodoDto, id: number) {
		const todo = await this.todoRepository.findOneBy({ id })
		if (!todo) {
			throw new BadRequestException()
		}
		const newTodo = await this.todoRepository.update(
			{ id },
			{ date, name, description, time }
		)
		return this.todoRepository.findOneBy({ id })
	}
	async delete(id: number) {
		const todo = await this.todoRepository.delete({ id })
		if (!todo.affected) {
			throw new BadRequestException()
		}
		return 'Success'
	}
	async getAll(userId: number) {
		const todos = await this.todoRepository.find({
			where: {
				userId
			}
		})
		console.log(todos)
		return todos
	}
	async getOne(id: number) {
		const todo = await this.todoRepository.findOneBy({ id })
		if (!todo) {
			throw new BadRequestException()
		}
		return todo
	}
	async search(userId: number, line: string) {
		const todos = await this.todoRepository.find({
			where: {
				userId
			}
		})
		console.log(todos)
		return todos.filter(item => item.name.includes(line))
	}
}
