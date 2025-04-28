import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
 // Đường dẫn chính xác

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: { userId: number }
  ): Promise<{ access_token: string }> {
    const token = await this.authService.generateToken(loginDto.userId);
    return { access_token: token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('protected')
  getProtected(): { message: string } {
    return { message: 'This is a protected route' };
  }
}
