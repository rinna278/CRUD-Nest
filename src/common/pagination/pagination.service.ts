import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/user/user.entity';

@Injectable()
export class PaginationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User> // Chỉnh sửa theo entity mà bạn cần phân trang
  ) {}

  async paginateUsers(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');
    return paginate<User>(queryBuilder, options);
  }
}
