import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Users {
	@PrimaryGeneratedColumn({ name: 'user_id' })
	id: number
	@Column()
	email: string
	@Column()
	password: string
}
