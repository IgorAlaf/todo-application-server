import { Injectable } from '@nestjs/common'
import { ProfileDto } from './dto/profile.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Profiles } from './entities/profiles.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(Profiles) private profileRepository: Repository<Profiles>
	) {}
	async save(
		user: any,
		{ name, surname, dateOfBirth, patronymic, phone, sex }: ProfileDto
	) {
		const exists = await this.profileRepository.findOneBy({ userId: user.id })
		if (exists) {
			const profileExists = await this.profileRepository.update(
				{ userId: user.id },
				{ name, sex, dateOfBirth, patronymic, phone, surname }
			)
			return this.profileRepository.findOneBy({ userId: user.id })
		}
		const newProfile = await this.profileRepository.create({
			name,
			surname,
			dateOfBirth,
			patronymic,
			phone,
			sex,
			avatar: '',
			userId: user.id
		})
		await this.profileRepository.save(newProfile)
		return newProfile
	}
	async getAvatar(user: any) {
		const avatar = await this.profileRepository.findOneBy({ userId: user.id })
		return avatar.avatar
	}
}
