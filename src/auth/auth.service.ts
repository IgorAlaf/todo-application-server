import { PassDto } from './dto/pass.dto'
import { UsersService } from './../users/users.service'
import { Injectable, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Users } from 'src/users/entities/user.entity'
import { AuthDto } from './dto/auth.dto'
import * as bcrypt from 'bcrypt'
import { SignInDto } from './dto/signin.dto'
@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async login(user: Users): Promise<AuthDto> {
		const payload: { email: string; id: number } = {
			email: user.email,
			id: user.id
		}
		const tokens = await this.usersService.createJwtTokens(payload)
		this.usersService.createTokens(user.id, tokens)
		return { user: payload, ...tokens }
	}
	async logout(user: Users) {
		this.usersService.removeToken(user.id)
	}
	async register(email: string, password: string): Promise<AuthDto> {
		const newUser = await this.usersService.create(email, password)
		return newUser
	}
	async refresh(refreshToken: string) {
		const token = await this.usersService.checkToken(refreshToken)
		const tokens = await this.usersService.createJwtTokens({
			email: token.email,
			id: token.id
		})
		this.usersService.createTokens(token.id, tokens)
		return { ...tokens }
	}

	async validateUser(email: string, password: string): Promise<Users | null> {
		const user = await this.usersService.findOne(email)
		if (!user) {
			return null
		}
		const hashPassword = bcrypt.compareSync(password, user.password)
		console.log(hashPassword)
		if (!hashPassword) {
			return null
		}
		return user
	}
	async updateEmail(user: any, signInDto: SignInDto) {
		return this.usersService.updateEmail(user, signInDto)
	}
	async updatePassword(user: any, passDto: PassDto) {
		return this.usersService.updatePassword(user, passDto)
	}
}
