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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Permissions('view_users')
  @Get()
  @ApiOperation({ summary: 'Get paginated list of users' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    type: [User],
  })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<Pagination<User>> {
    const options: IPaginationOptions = { page, limit, route: '/users' };
    return this.usersService.findAllUser(options);
  }

  @Permissions('create_user')
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User has been created.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request or role not found.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  @Permissions('find_user_by_id')
  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  async findUserById(@Param('id') id: number): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Permissions('update_user')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  update(@Param('id') id: string, @Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.updateUser(+id, dto);
  }

  @Permissions('delete_user')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(+id);
  }
}
