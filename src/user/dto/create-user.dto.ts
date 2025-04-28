import { IsString, IsEmail, IsOptional, IsNumberString } from 'class-validator';

export class CreateUserDto {
  @IsNumberString()
  name: string;

  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  role: string;
}
