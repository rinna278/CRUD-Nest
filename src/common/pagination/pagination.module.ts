import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {}
