import {
  CanActivate,
  ExecutionContext,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // 获取请求头中的token
    if (!token) {
      return false; // 如果token不存在，则拒绝访问
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      }); // 验证token
      request.user = decoded; // 将解码后的用户信息存储到请求对象中
      return true;
    } catch (e) {
      return false;
    }
  }
}
