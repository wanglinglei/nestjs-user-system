//全局异常处理

import { BUSINESS_HTTP_CODE } from '@/constants/httpCode';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
export interface ExceptionData {
  rtnCode: BUSINESS_HTTP_CODE;
  message: string;
}

@Catch()
export class HttpFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 处理异常
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 返回错误响应
    const data = exception.getResponse();
    const { rtnCode, message } = data as ExceptionData;
    const errorRes = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      rtnCode,
      message,
    };
    // 设置响应状态码
    response.statusCode = status;
    // 返回错误响应
    response.log.error(exception.stack);
    response.send(errorRes);
  }
}

export function throwBusinessError(
  rtnCode: BUSINESS_HTTP_CODE,
  message: string,
) {
  throw new HttpException({ rtnCode, message }, HttpStatus.OK);
}
