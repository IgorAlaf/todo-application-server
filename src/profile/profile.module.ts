import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Profiles } from './entities/profiles.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Profiles])],
	controllers: [ProfileController],
	providers: [ProfileService]
})
export class ProfileModule {}
