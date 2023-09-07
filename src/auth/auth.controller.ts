import {
	ApiTags,
	ApiResponse,
	ApiBearerAuth,
	ApiCookieAuth,
	ApiOperation,
	ApiBody,
	ApiParam
} from '@nestjs/swagger'
import {
	Controller,
	Get,
	Patch,
	Post,
	Body,
	HttpCode,
	UseGuards,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/signin.dto'
import { LocalAuthGuard } from './local-auth.guard'
import { JwtAuthGuard } from './jwt-auth.guard'
import { Request, Response } from 'express'
import {
	ExceptionBadRequest,
	ExceptionServerInternal,
	ExceptionUnauthorized
} from 'src/types/indes'
import { AuthDto, TokensDto, UserDto } from './dto/auth.dto'
import { PassDto } from './dto/pass.dto'
@ApiTags('Auth')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiResponse({ status: 401, type: ExceptionUnauthorized })
@ApiResponse({ status: 400, type: ExceptionBadRequest })
@ApiResponse({ status: 500, type: ExceptionServerInternal })
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@HttpCode(200)
	@ApiResponse({ status: 200, type: AuthDto })
	@ApiOperation({ summary: 'Login user' })
	@Post('login')
	async login(
		@Body() signInDto: SignInDto,
		@Res({ passthrough: true }) response
	) {
		const user = await this.authService.validateUser(
			signInDto.email,
			signInDto.password
		)
		if (!user) {
			throw new UnauthorizedException()
		}
		const res = await this.authService.login(user)
		response.cookie('refreshToken', res.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})
		return res
	}
	@HttpCode(201)
	@ApiOperation({ summary: 'Register user' })
	@ApiResponse({ status: 201, type: AuthDto })
	@Post('register')
	async register(
		@Body() body: SignInDto,
		@Res({ passthrough: true }) response: Response
	) {
		const res = await this.authService.register(body.email, body.password)
		response.cookie('refreshToken', res.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})
		return res
	}
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@HttpCode(200)
	@ApiOperation({ summary: 'Logout user' })
	@Get('logout')
	logout(@Req() req) {
		return this.authService.logout(req.user)
	}
	@HttpCode(200)
	@ApiResponse({ status: 200, type: TokensDto })
	@ApiOperation({ summary: 'Refresh bearer token' })
	@Get('refresh')
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) response: Response
	) {
		const { refreshToken } = req.cookies
		if (!refreshToken) {
			throw new UnauthorizedException()
		}
		const tokens = await this.authService.refresh(refreshToken)
		response.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})
		return { ...tokens }
	}
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 200, type: UserDto })
	@ApiOperation({ summary: 'Update user email' })
	@Patch('update-email')
	updateEmail(@Req() req: Request, @Body() signInDto: SignInDto) {
		return this.authService.updateEmail(req.user, signInDto)
	}
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 200, type: UserDto })
	@ApiOperation({ summary: 'Update user password' })
	@Patch('update-pass')
	updatePassword(@Req() req: Request, @Body() passDto: PassDto) {
		return this.authService.updatePassword(req.user, passDto)
	}
}
