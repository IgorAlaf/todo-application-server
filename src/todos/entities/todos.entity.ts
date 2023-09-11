import { Users } from 'src/users/entities/user.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Todos {
	@PrimaryGeneratedColumn({ name: 'todo_id' })
	id: number
	@Column()
	title: string
	@Column({ name: 'user_id' })
	// @ManyToOne(() => Users, user => user.id)
	userId: number
	@Column()
	description: string
	@Column({ name: 'task_date' })
	date: string
	@Column({ name: 'task_time' })
	time: string
	@Column()
	checked: boolean
}
