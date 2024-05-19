import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as cors from 'cors';

import { AppModule } from './app.module';

import secureSession from '@fastify/secure-session';
import { GlobalMiddleware } from './middleware/global/global.middleware';
import { contentParser } from 'fastify-file-interceptor';

import { Response } from './common/response';
import { HttpFilter } from './common/filter';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // 添加跨域配置
  app.use(cors());
  // 添加全局中间件
  app.use(GlobalMiddleware);
  app.useGlobalInterceptors(new Response());
  app.useGlobalFilters(new HttpFilter());
  app.register(contentParser);
  await app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
  });
  await app.listen(3000);
}
bootstrap();
