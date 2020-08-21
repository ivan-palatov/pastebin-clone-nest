import { IsOptional, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsOptional()
  currentPassword?: string;

  @IsString()
  @Length(6)
  newPassword!: string;
}
