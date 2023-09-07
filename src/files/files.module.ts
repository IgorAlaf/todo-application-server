import { Module } from '@nestjs/common'
import { FilesController } from './files.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Profiles } from 'src/profile/entities/profiles.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Profiles])],
	controllers: [FilesController]
})
export class FilesModule {}
