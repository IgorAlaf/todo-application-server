import { Users } from 'src/users/entities/user.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Todos {
	@PrimaryGeneratedColumn()
	id: number
	@Column()
	name: string
	@Column()
	description: string
	@Column({ name: 'task_date' })
	date: string
	@Column({ name: 'task_time' })
	time: string
	@Column({ name: 'user_id' })
	@ManyToOne(type => Users, user => user.id)
	userId: number
}
