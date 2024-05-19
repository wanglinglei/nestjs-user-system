//全局异常处理

import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 处理异常
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: exception.message,
    });
  }
}
