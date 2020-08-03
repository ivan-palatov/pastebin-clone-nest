import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 25)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  password: string;
}
