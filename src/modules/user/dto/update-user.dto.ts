import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  password?: string;
  nickname?: string;
  avatar?: string;
  loginTime?: Date;
}

export class UpdataUserPasswordDto {
  // 用户名
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须为字符串' })
  username: string;
  // 旧密码
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
  // 新密码
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
