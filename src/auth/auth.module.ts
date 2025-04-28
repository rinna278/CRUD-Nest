import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'hihimykey', // Thay thế bằng một key mạnh
      signOptions: { expiresIn: '60s' }, // Thời gian hết hạn
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
