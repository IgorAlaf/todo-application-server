import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Users } from './entities/user.entity'
import { Repository } from 'typeorm'
import { Tokens } from './entities/token.entity'
import {
	BadRequestException,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common'
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { ITokens } from 'src/types/indes'
import { AuthDto } from 'src/auth/dto/auth.dto'
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users) private userRepository: Repository<Users>,
		@InjectRepository(Tokens) private tokenRepository: Repository<Tokens>,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async findOne(email: string): Promise<Users | null> {
		return this.userRepository.findOneBy({ email })
	}
	async create(email: string, password: string): Promise<AuthDto | null> {
		const user = await this.userRepository.findOneBy({ email })
		if (user) {
			throw new BadRequestException()
		}
		const saltOrRounds = 3
		const hash = await bcrypt.hash(password, saltOrRounds)
		const newUser = await this.userRepository.create({ email, password: hash })
		await this.userRepository.save(newUser)
		const tokens = await this.createJwtTokens({ email, id: newUser.id })
		const newTokens = await this.createTokens(newUser.id, tokens)
		const userResponse: { email: string; id: number } = { ...newUser }
		return { ...tokens, user: userResponse }
	}
	async createTokens(
		userId: number,
		{ accessToken, refreshToken }: ITokens
	): Promise<Tokens | null> {
		const existsToken = await this.tokenRepository.findOneBy({ userId })
		if (existsToken) {
			await this.tokenRepository.update(
				{ id: existsToken.id, userId },
				{ accessToken, refreshToken }
			)
		} else {
			await this.tokenRepository.save({
				accessToken,
				refreshToken,
				userId
			})
		}
		const newTokens = this.tokenRepository.findOneBy({ userId })
		if (newTokens) {
			return newTokens
		}
		throw new InternalServerErrorException()
	}
	async createJwtTokens(payload: {
		email: string
		id: number
	}): Promise<ITokens> {
		const accessToken = this.jwtService.sign(payload, {
			secret: this.configService.get('SECRET_KEY'),
			expiresIn: '10m'
		})
		const refreshToken = this.jwtService.sign(payload, {
			secret: this.configService.get('SECRET_KEY'),
			expiresIn: '30d'
		})
		return { accessToken, refreshToken }
	}
	async removeToken(id: number) {
		this.tokenRepository.delete({ userId: id })
		return 'Success'
	}
	async checkToken(refreshToken: string) {
		try {
			const token = await this.jwtService.verify(refreshToken, {
				secret: this.configService.get('SECRET_KEY')
			})
			if (!token) {
				throw new UnauthorizedException()
			}
			return token
		} catch (e) {
			throw new InternalServerErrorException()
		}
	}
}
