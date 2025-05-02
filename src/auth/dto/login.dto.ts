import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15, { message: 'Password must not exceed 15 characters' })
  password: string;
}
