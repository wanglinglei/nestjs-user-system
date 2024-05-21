// 全局响应拦截器

import { CallHandler, NestInterceptor, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BUSINESS_HTTP_CODE } from '@/constants/httpCode';
interface Data<T> {
  data: T;
}
@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(context, next: CallHandler): Observable<Data<T>> {
    // 处理响应
    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          rtnCode: BUSINESS_HTTP_CODE.SUCCESS,
          message: 'success',
          data,
        };
      }),
    );
  }
}
