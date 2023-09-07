import { Users } from 'src/users/entities/user.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm'

@Entity()
export class Profiles {
	@PrimaryGeneratedColumn()
	id: number
	@Column()
	name: string
	@Column()
	surname: string
	@Column()
	patronymic: string
	@Column({ name: 'date_of_birth' })
	dateOfBirth: Date
	@Column()
	sex: string
	@Column()
	phone: string
	@Column()
	avatar: string
	@Column({ name: 'user_id' })
	@OneToOne(type => Users, user => user.id)
	userId: number
}
