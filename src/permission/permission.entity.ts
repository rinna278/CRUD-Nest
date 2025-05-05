import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../role/role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn({ name: 'permission_id' })
  permissionId: number;

  @Column({ name: 'permission_name' })
  permissionName: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
