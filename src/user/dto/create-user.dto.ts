import { IsString, IsEmail, IsNumberString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullname: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;
}
