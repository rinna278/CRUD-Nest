import {
  Controller,
  UseGuards,
  Post,
  Body,
  UnauthorizedException,
  Get,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const { username, password } = loginDto;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    const user = await this.userService.findUserById(userId);
    return user;
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.RESET_PASSWORD_SECRET,
      });

      const user = await this.userService.findUserById(payload.sub);
      // user.password = await bcrypt.hash(newPassword, 10);
      await this.userService.updateUser(user.userId, { password: newPassword });

      return { message: 'Password reset successfully' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
