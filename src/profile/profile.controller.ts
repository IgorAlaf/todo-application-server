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
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Profiles } from './entities/profiles.entity'
import { ResProfileDto } from './dto/resProfile.dto'
import { ExceptionBadRequest, ExceptionUnauthorized } from 'src/types/indes'
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
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}
	@Post('save/')
	@HttpCode(201)
	@ApiResponse({
		status: 201,
		description: 'Saving user profile is success',
		type: ResProfileDto
	})
	save(@Req() req, @Body() profileDto: ProfileDto) {
		return this.profileService.save(req.user, profileDto)
	}
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
}
