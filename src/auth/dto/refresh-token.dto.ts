import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token should not be empty' })
  @MinLength(16, {
    message: 'Refresh token must be at least 16 characters long',
  })
  refreshToken: string;
}
