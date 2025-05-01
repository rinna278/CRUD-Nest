import { IsString, IsEmail, IsNumberString } from 'class-validator';

export class CreateUserDto {
  @IsNumberString()
  fullname: string;

  @IsString()
  user_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;
}
