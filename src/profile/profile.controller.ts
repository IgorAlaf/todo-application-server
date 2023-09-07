import {
	Controller,
	Post,
	UseGuards,
	HttpCode,
	Req,
	Body,
	Get,
	Res,
	Param
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Request, Response } from 'express'
import { ProfileDto } from './dto/profile.dto'
import {
	ApiTags,
	ApiResponse,
	ApiBearerAuth,
	ApiOperation
} from '@nestjs/swagger'
import { Profiles } from './entities/profiles.entity'
import { ResProfileDto } from './dto/resProfile.dto'
import {
	ExceptionBadRequest,
	ExceptionNotFounded,
	ExceptionServerInternal,
	ExceptionUnauthorized
} from 'src/types/indes'
@Controller('profile')
@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({
	status: 401,
	description: 'User not unauthorized',
	type: ExceptionUnauthorized
})
@ApiResponse({ status: 400, type: ExceptionBadRequest })
@ApiResponse({ status: 500, type: ExceptionServerInternal })
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}
	@Post('save/')
	@HttpCode(200)
	@ApiOperation({ summary: 'Save user profile' })
	@ApiResponse({
		status: 200,
		description: 'Saving user profile is success',
		type: ResProfileDto
	})
	save(@Req() req, @Body() profileDto: ProfileDto) {
		return this.profileService.save(req.user, profileDto)
	}
	@ApiOperation({ summary: 'Get user avatar' })
	@ApiResponse({ status: 200, description: 'Avatar received successfully' })
	@Get('/image')
	async getImage(@Req() req: Request, @Res() res: Response) {
		const avatar = await this.profileService.getAvatar(req.user)
		const response = avatar
			? res.sendFile(avatar, { root: './uploads' })
			: res.sendFile('standart.png', { root: './uploads' })
		return {
			data: response
		}
	}
	@ApiOperation({ summary: 'Get user profile' })
	@ApiResponse({ status: 404, type: ExceptionNotFounded })
	@ApiResponse({ status: 200, description: 'Get profile', type: ResProfileDto })
	@Get('get')
	getProfile(@Req() req: Request) {
		return this.profileService.getProfile(req.user)
	}
}
