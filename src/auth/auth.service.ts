// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * Validate the username and password.
   * Returns the user object (excluding the password) if valid,
   * or null if invalid.
   */
  async validateUser(
    username: string,
    pass: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findUserByUsername(username);
    if (user && (await this.usersService.comparePassword(user, pass))) {
      // Exclude the password field before returning
      // @ts-ignore
      // const { password, ...result } = user;
      return user;
    }
    return null;
  }

  /**
   * Generate an access token from user information.
   * The controller will call this method to return the token.
   */
  async login(
    user: Omit<User, 'password'>
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.role?.permissions?.map((p) => p.permissionName) || [],
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      // Verify the refresh token
      const decoded = this.jwtService.verify(refreshToken);

      // Generate a new access token from the decoded data
      const payload = {
        sub: decoded.sub,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions,
      };

      const new_access_token = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      return { access_token: new_access_token };
    } catch (error) {
      throw new BadRequestException('Invalid or expired refresh token');
    }
  }
  async forgotPassword(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const payload = {
      username: user.username,
      sub: user.userId,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.RESET_PASSWORD_SECRET,
      expiresIn: '2m',
    });
    const resetLink = `https://nguyentuanlinh.com/reset-password?token=${token}`;
    console.log(`🔐 Reset password link: ${resetLink}`);
    return { message: 'Reset password link sent to email' };
  }
}
