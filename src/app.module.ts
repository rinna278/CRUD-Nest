import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres', // phải khớp với tên service trong docker-compose
      port: 5432,
      username: 'nestuser',
      password: 'nestpass',
      database: 'nestdb',
      autoLoadEntities: true,
      synchronize: true, // chỉ nên dùng khi dev
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
