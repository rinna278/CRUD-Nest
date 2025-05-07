import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class AddPermissionDto {
  @IsArray({ message: 'permissionNames must be an array' })
  @IsString({ each: true, message: 'Each permission name must be a string' })
  @IsNotEmpty({ message: 'permissionNames array cannot be empty' })
  permissionNames: string[];
}
