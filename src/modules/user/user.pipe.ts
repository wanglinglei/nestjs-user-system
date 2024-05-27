import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BUSINESS_HTTP_CODE } from '@/constants/httpCode';
@Injectable()
export class UserPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const dto = plainToInstance(metadata.metatype, value, {
      // excludeExtraneousValues: true, // 排除多余的字段
      // exposeUnsetFields: false, // 暴露未设置的字段
    });
    const errors = await validate(dto);
    if (errors.length) {
      const firstError = errors[0];
      const { constraints } = firstError;
      const message = Object.values(constraints).join(', ');
      const errorData = {
        message,
        rtnCode: BUSINESS_HTTP_CODE.BUSINESS_ERROR,
      };
      throw new HttpException(errorData, HttpStatus.OK);
    }
    return value;
  }
}
