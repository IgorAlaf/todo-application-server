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
import { SignInDto } from 'src/auth/dto/signin.dto'
import { PassDto } from 'src/auth/dto/pass.dto'
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
		// const userResponse: { email: string; id: number } = { ...newUser }
		return { ...tokens, user: { email: newUser.email, id: newUser.id } }
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
			expiresIn: '60m'
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
	async updateEmail(user: any, signInDto: SignInDto) {
		const userExists = await this.userRepository.findOneBy({ id: user.id })
		const equal = await bcrypt.compare(signInDto.password, userExists.password)
		if (!equal) {
			throw new BadRequestException()
		}
		const before = await this.userRepository.findOneBy({
			email: signInDto.email
		})
		if (before) {
			throw new BadRequestException()
		}
		await this.userRepository.update(
			{ id: user.id },
			{ email: signInDto.email }
		)
		const userNew = await this.userRepository.findOneBy({ id: user.id })
		return { email: userNew.email, id: userNew.id }
	}
	async updatePassword(user: any, passDto: PassDto) {
		const userExists = await this.userRepository.findOneBy({ id: user.id })
		const equal = await bcrypt.compare(passDto.password, userExists.password)
		if (!equal) {
			throw new BadRequestException()
		}
		const hash = await bcrypt.hash(passDto.newPassword, 3)
		await this.userRepository.update({ id: user.id }, { password: hash })
		const userNew = await this.userRepository.findOneBy({ id: user.id })
		return { email: userNew.email, id: userNew.id }
	}
}
