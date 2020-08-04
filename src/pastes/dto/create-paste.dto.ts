import { Exposure } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreatePasteDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsEnum(Exposure)
  exposure: Exposure;

  @IsOptional()
  @IsNumber()
  @Max(527040)
  expiresIn?: number;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsBoolean()
  asUser: boolean;
}
