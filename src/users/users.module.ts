import { JwtModule, JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { Users } from './entities/user.entity'
import { Tokens } from './entities/token.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Users, Tokens]), JwtModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule {}
