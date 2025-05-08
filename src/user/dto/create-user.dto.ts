import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name should not be empty' })
  fullname: string;

  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username should not be empty' })
  username: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email của user' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Role ID should not be empty' })
  @IsNumberString({ no_symbols: true }, { message: 'Role ID must be a number' })
  role_id: number;
}
