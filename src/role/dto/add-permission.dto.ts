import { IsArray, IsString } from 'class-validator';

export class AddPermissionDto {
  @IsArray()
  @IsString({ each: true })
  permissionNames: string[];
}
