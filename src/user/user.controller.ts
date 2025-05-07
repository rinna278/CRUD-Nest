import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../user/user.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('users')
// @UseGuards(JwtAuthGuard, PermissionGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Permissions('view_users')
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<Pagination<User>> {
    const options: IPaginationOptions = { page, limit, route: '/users' };
    return this.usersService.findAllUser(options);
  }

  @Permissions('create_user')
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Permissions('find_user_by_id')
  @Get(':id')
  async findUserById(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Permissions('update_user')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateUserDto) {
    return this.usersService.updateUser(+id, dto);
  }

  @Permissions('delete_user')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
