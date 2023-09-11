import { Injectable, NotFoundException } from '@nestjs/common'
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
	async create(
		{ title, description, date, time, checked }: TodoDto,
		userId: number
	) {
		const todo = await this.todoRepository.create({
			title,
			description,
			date,
			time,
			userId,
			checked
		})
		await this.todoRepository.save(todo)
		return todo
	}
	async update(
		{ title, description, date, time, checked }: TodoDto,
		id: number
	) {
		const todo = await this.todoRepository.findOneBy({ id })
		if (!todo) {
			throw new NotFoundException()
		}
		const newTodo = await this.todoRepository.update(
			{ id },
			{ date, title, description, time, checked }
		)
		return this.todoRepository.findOneBy({ id })
	}
	async delete(id: number) {
		const todo = await this.todoRepository.delete({ id })
		if (!todo.affected) {
			throw new NotFoundException()
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
			throw new NotFoundException()
		}
		return todo
	}
	async search(userId: number, title: string) {
		const todos = await this.todoRepository.find({
			where: {
				userId
			}
		})
		return todos.filter(item => item.title.includes(title))
	}
}
