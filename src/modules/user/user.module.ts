import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { LoggerMiddleware } from '../../middleware/logger/logger.middleware';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Group]),
    forwardRef(() => AuthModule),
  ], // 注册实体
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('user');
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'user',
      // 不被拦截的请求方式
      method: RequestMethod.POST,
    });
  }
}
