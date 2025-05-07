import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Role } from 'src/role/role.entity';
import { RoleModule } from 'src/role/role.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { PaginationService } from 'src/common/pagination/pagination.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    RoleModule,
    PaginationModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
