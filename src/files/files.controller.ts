import {
	ApiProperty,
	ApiBody,
	ApiTags,
	ApiResponse,
	ApiBearerAuth,
	ApiConsumes
} from '@nestjs/swagger'
import {
	Controller,
	Get,
	Post,
	UseInterceptors,
	UploadedFile,
	UploadedFiles,
	Res,
	Param,
	Req,
	UseGuards,
	HttpStatus
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { editFileName, imageFileFilter } from '../utils/file-upload.utils'
import { Profiles } from 'src/profile/entities/profiles.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ResProfileDto } from 'src/profile/dto/resProfile.dto'
import { ExceptionBadRequest, ExceptionUnauthorized } from 'src/types/indes'

class FileUploadDto {
	@ApiProperty({ type: 'string', format: 'binary' })
	image: any
}
@ApiTags('Files')
@ApiBearerAuth()
@ApiResponse({ status: 401, type: ExceptionUnauthorized })
@ApiResponse({ status: 400, type: ExceptionBadRequest })
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
	constructor(
		@InjectRepository(Profiles) private profileRepository: Repository<Profiles>
	) {}
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Image with extends png , jpg , gif',
		type: FileUploadDto
	})
	@ApiResponse({
		status: 201,
		type: ResProfileDto,
		description: 'Profile user with new avatar'
	})
	@Post('upload')
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads',
				filename: editFileName
			}),
			fileFilter: imageFileFilter
		})
	)
	async uploadedFile(@Req() req, @UploadedFile() file) {
		const res = {
			originalname: file.originalname,
			filename: file.filename
		}
		const exists = this.profileRepository.findOneBy({ userId: req.user.id })
		if (exists) {
			const response = await this.profileRepository.update(
				{ userId: req.user.id },
				{ avatar: res.filename }
			)
			return this.profileRepository.findOneBy({ userId: req.user.id })
		}
		const response = await this.profileRepository.create({
			userId: req.user.id,
			avatar: res.filename
		})
		return response
	}
}
