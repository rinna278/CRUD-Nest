import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity'; // Đảm bảo đường dẫn đúng

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}

  // Phương thức tìm kiếm quyền theo ID
  async findPermissionById(permissionId: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { permissionId },
    });

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`
      );
    }

    return permission;
  }
}
