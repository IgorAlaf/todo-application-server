import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { Users } from './users/entities/user.entity'
import { Tokens } from './users/entities/token.entity'
import { ProfileModule } from './profile/profile.module'
import { TodosModule } from './todos/todos.module'
import { Todos } from './todos/entities/todos.entity'
import { Profiles } from './profile/entities/profiles.entity'
import { MulterModule } from '@nestjs/platform-express'
import { FilesModule } from './files/files.module'
@Module({
	imports: [
		UsersModule,
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true
		}),
		AuthModule,
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DATABASE_HOST'),
				port: configService.get('DATABASE_PORT'),
				username: configService.get('DATABASE_USER'),
				password: configService.get('DATABASE_PASSWORD'),
				database: configService.get('DATABASE_NAME'),
				entities: [Users, Tokens, Todos, Profiles]
			}),
			inject: [ConfigService]
		}),
		ProfileModule,
		TodosModule,
		MulterModule.register({
			dest: './uploads'
		}),
		FilesModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
