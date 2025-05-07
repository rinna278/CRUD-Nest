import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Username should not be empty' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password: string;
}
