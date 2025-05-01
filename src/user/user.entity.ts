import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'Id' }) // chú ý ánh xạ
  user_id: number;

  @Column({ length: 255, name: 'Tên' })
  fullname: string;

  @Column({ length: 255, unique: true, name: 'Tên đăng nhập' })
  user_name: string;

  @Column({ length: 255, unique: true, name: 'Email' })
  email: string;

  @Column({ length: 255, name: 'Mật khẩu' })
  password: string;

  @Column({ length: 255, name: 'Vai trò', default: () => 'user' })
  role: string;

  @Column({
    type: 'timestamp',
    name: 'Created at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    name: 'Updated at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
