import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Role name must be a string' })
  @IsNotEmpty({ message: 'Role name should not be empty' })
  @MinLength(3, { message: 'Role name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Role name must not exceed 50 characters' })
  roleName: string;
}
