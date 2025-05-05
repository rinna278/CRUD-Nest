import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from 'src/permission/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto); // Tạo instance Role
    return await this.roleRepository.save(role); // Lưu vào cơ sở dữ liệu
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find(); // Lấy tất cả các role
  }

  async deleteRole(roleId: number): Promise<void> {
    const result = await this.roleRepository.delete(roleId);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
  }

  async findRoleById(roleId: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
    return role;
  }

  async addPermissionsToRole(roleId: number, permissionNames: string[]) {
    const role = await this.roleRepository.findOne({
      where: { roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const newPermissions = await Promise.all(
      permissionNames.map(async (name) => {
        // Kiểm tra xem quyền đã tồn tại chưa
        const existingPermission = await this.permissionRepository.findOne({
          where: { permissionName: name },
        });
        if (existingPermission) {
          return existingPermission; // Nếu quyền đã tồn tại, trả về quyền hiện có
        }
        // Nếu không, tạo quyền mới
        return this.permissionRepository.create({ permissionName: name });
      })
    );

    role.permissions.push(...newPermissions);

    return this.roleRepository.save(role);
  }

  async removePermissionFromRole(
    roleId: number,
    permissionId: number
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { roleId: roleId }, // Sử dụng 'roleId' từ entity
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const permission = role.permissions.find(
      (p) => p.permissionId === permissionId
    ); // Sử dụng 'permissionId'
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found in role`
      );
    }

    // Xóa permission khỏi role
    role.permissions = role.permissions.filter(
      (p) => p.permissionId !== permissionId
    );
    return await this.roleRepository.save(role);
  }

  async getPermissionsOfRole(roleId: number): Promise<string[]> {
    const role = await this.roleRepository.findOne({
      where: { roleId: roleId }, // Sử dụng 'roleId'
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role.permissions.map((p) => p.permissionName); // Đảm bảo rằng `permissionName` là đúng
  }
}
