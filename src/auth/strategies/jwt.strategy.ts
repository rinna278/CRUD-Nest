import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hihimykey', // Phải trùng với secret trong JwtModule
    });
  }

  async validate(payload: any) {
    // Giá trị trả về sẽ được gán vào request.user
    return { userId: payload.userId };
  }
}
