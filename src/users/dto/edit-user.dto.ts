import { IsString, Length } from 'class-validator';

export class EditUserDto {
  @IsString()
  @Length(2, 25)
  name!: string;
}
