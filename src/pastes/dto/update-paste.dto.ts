import { Exposure } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class UpdatePasteDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsNumber()
  @Max(527040)
  expiresIn?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsEnum(Exposure)
  exposure: Exposure;
}
