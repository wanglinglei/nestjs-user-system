//全局异常处理

import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class HttpFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // console.log('HttpFilter', exception, host);
    // 处理异常
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log('exception', exception);
    // 返回错误响应
    const data = exception.getResponse();
    const errorRes = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      data,
    };
    // 设置响应状态码
    response.statusCode = status;
    // 返回错误响应
    response.log.error(exception.stack);
    response.send(errorRes);
  }
}
