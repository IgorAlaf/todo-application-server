import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm'
import { Users } from './user.entity'

@Entity()
export class Tokens {
	@PrimaryGeneratedColumn({ name: 'token_id' })
	id: number
	@Column({ name: 'access_token' })
	accessToken: string
	@Column({ name: 'refresh_token' })
	refreshToken: string
	@Column({ name: 'user_id' })
	@OneToOne(type => Users, user => user.id)
	userId: number
}
