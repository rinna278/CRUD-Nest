import {
  Controller,
  UseGuards,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() { username, password }: LoginDto
  ): Promise<{ access_token: string }> {
    // 1) Validate credentials
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // 2) Issue JWT
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return { user: req.user }; // Trả về đối tượng chứa thông tin người dùng
  }
}
