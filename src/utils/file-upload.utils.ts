import { extname } from 'path'
import utf8 from 'utf8'
import { v4 as uuidv4 } from 'uuid'
import { HttpException, HttpStatus } from '@nestjs/common'
// Разрешить только изображения
export const imageFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return callback(
			new HttpException(
				'Only image files are allowed!',
				HttpStatus.BAD_REQUEST
			),
			false
		)
	}
	callback(null, true)
}
export const editFileName = (req, file, callback) => {
	const name = uuidv4()
	const fileExtName = extname(file.originalname)
	callback(null, `${name}${fileExtName}`)
}
