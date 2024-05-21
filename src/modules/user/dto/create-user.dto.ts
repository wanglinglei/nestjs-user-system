import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  // 用户名
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须为字符串' })
  username: string;
  // 密码
  password: string;
  // 验证码
  code?: string;
}
