import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class CaptureDTO {
	@IsUrl()
	url: string

	@IsInt()
	@Max(4096)
	@Min(1)
	@Transform(({ value }) => parseInt(value))
	@IsOptional()
	width: number = 1024

	@IsInt()
	@Max(4096)
	@Min(1)
	@Transform(({ value }) => parseInt(value))
	@IsOptional()
	height: number = 768

	@IsInt()
	@Max(2)
	@Min(1)
	@Transform(({ value }) => parseInt(value))
	@IsOptional()
	scale: number = 1

	@IsInt()
	@Max(60)
	@Min(1)
	@Transform(({ value }) => parseInt(value))
	@IsOptional()
	timeout: number = 15

	@IsInt()
	@Min(0)
	@Max(5)
	@Transform(({ value }) => parseInt(value))
	@IsOptional()
	delay: number = 0

	@IsString()
	@IsNotEmpty()
	@IsIn(['jpeg', 'png'])
	@IsOptional()
	mime_type: 'jpeg' | 'png' = 'jpeg'

	@IsInt()
	@Min(0)
	@Max(100)
	@Transform(({ value }) => parseFloat(value))
	@IsOptional()
	quality: number = 90
}

// export const captureDto = Joi.object({
//     url: Joi.string().uri().required(),
//
//     width: Joi.number().integer().positive().optional().default(1024),
//
//     height: Joi.number().integer().positive().optional().default(768),
//
//     delay: Joi.number().integer().positive().optional().default(0),
//
//     mime_type: Joi.string().valid('jpeg', 'png', 'webp').optional().default('webp'),
//
//     quality: Joi.number().min(0).max(1).optional().default(0.8),
//
// });
