import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
@Injectable()
export class UserPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const dto = plainToInstance(metadata.metatype, value, {
      excludeExtraneousValues: true, // 排除多余的字段
      exposeUnsetFields: false, // 暴露未设置的字段
    });
    const errors = await validate(dto);
    console.log(errors);
    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
