import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Pagination,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Role } from 'src/role/role.entity';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly roleService: RoleService
  ) {}

  async findAllUser(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');
    return paginate<User>(queryBuilder, options);
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['role', 'role.permissions'], // 👈 Load quan hệ role
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'role.permissions'], // 👈 Load quan hệ role
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findUserWithPermissions(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['role', 'role.permissions'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    // console.log('user ', user);
    return user || null;
  }

  comparePassword(user: User, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.password);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds
      );

      // Lấy role dựa trên role_id
      const role = await this.roleService.findRoleById(createUserDto.role_id);
      if (!role) {
        throw new BadRequestException(
          `Role with ID ${createUserDto.role_id} not found`
        );
      }

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Could not create user');
    }
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<CreateUserDto>
  ): Promise<User> {
    const user = await this.findUserById(id);

    // re-hash password if it is being updated
    if (updateUserDto.password) {
      const saltOrRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds
      );
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
