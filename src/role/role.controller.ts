import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Delete,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { PermissionService } from 'src/permission/permission.service';

class AddPermissionDto {
  permissionNames: string[];
}

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService
  ) {}

  @Permissions('create_role')
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }

  @Permissions('view_roles')
  @Get()
  async getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }

  @Permissions('delete_role')
  @Delete(':id')
  async deleteRole(@Param('id') id: number): Promise<void> {
    return this.roleService.deleteRole(id);
  }

  @Permissions('add_permissions')
  @Post(':id/permissions')
  async addPermissionsToRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddPermissionDto
  ) {
    const role = await this.roleService.findRoleById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return this.roleService.addPermissionsToRole(id, dto.permissionNames);
  }

  @Permissions('view_permission_of_role')
  @Get(':id/permissions')
  async getPermissionsOfRole(@Param('id', ParseIntPipe) id: number) {
    const permissions = await this.roleService.getPermissionsOfRole(id);
    return { roleId: id, permissions };
  }

  @Permissions('remove_permissions')
  @Delete(':roleId/permissions/:permissionId')
  async removePermission(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number
  ): Promise<Role> {
    const role = await this.roleService.findRoleById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const permission =
      await this.permissionService.findPermissionById(permissionId);
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`
      );
    }

    return this.roleService.removePermissionFromRole(roleId, permissionId);
  }
}
