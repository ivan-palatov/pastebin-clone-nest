import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(6)
  currentPassword!: string;

  @IsString()
  @Length(6)
  newPassword!: string;
}
