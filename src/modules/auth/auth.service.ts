// src/logical/auth/auth.service.ts
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { encryptPassword } from 'src/utils/cryptogram';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthStatus } from './constants';

@Injectable()
export class AuthService {
  // 创建实例
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) { }
  // JWT验证-step 2：验证用户信息
  async validateUser(
    username: string,
    password: string,
  ): Promise<{ status: AuthStatus; user: User | null }> {
    console.log('Jwt验证 - Step 2：校验用户信息');
    const user = await this.usersService.findOneAllInfoByUsername(username);
    console.log(user);
    if (user) {
      const salt = user.salt;
      const userPassword = user.password;

      //通过密码盐加密传参，再和数据库的比较，判断是否相等
      const hashPassword = encryptPassword(password, salt);
      console.log('hashPassword', user, hashPassword, userPassword, salt);
      if (userPassword === hashPassword) {
        return {
          status: AuthStatus['SUCCESS'],
          user,
        };
      } else {
        return {
          status: AuthStatus['ERROR'],
          user: null,
        };
      }
    }
    // 查无此人
    return {
      status: AuthStatus['NOT_FOUND'],
      user: null,
    };
  }

  // jwt验证-step 3：处理jwt签证
  async certificate(user: { uid: number; username: string }) {
    const payload = {
      username: user.username,
      uid: user.uid,
      // realName: user.realName,
      // role: user.role,
    };
    console.log('JWT验证 - Step 3: 处理 jwt 签证');
    try {
      const token = this.jwtService.sign(payload);
      return token;
    } catch (error) {
      return null;
    }
  }
}
