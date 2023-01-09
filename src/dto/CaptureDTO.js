import {IsIn, IsNumber, IsOptional, IsPositive, IsString, IsUrl, Max, Min} from "class-validator";

export class CaptureDTO {
    @IsUrl()
    url;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    width = 1024;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    height = 768;

    @IsNumber()
    @IsOptional()
    delay = 0;

    @IsString()
    @IsIn(['jpeg', 'png', 'webp'])
    @IsOptional()
    mime_type = 'webp';

    @IsNumber()
    @Min(0)
    @Max(1)
    @IsOptional()
    quality = 0.8;
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