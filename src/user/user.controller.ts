import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { User } from './user.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAllUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<Pagination<User>> {
    const options: IPaginationOptions = {
      page: +page,
      limit: +limit,
      route: '/users', // dùng để tạo các link next/prev/last/first
    };

    return this.userService.findAllUser(options);
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return this.userService.updateUser(+id, createUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
