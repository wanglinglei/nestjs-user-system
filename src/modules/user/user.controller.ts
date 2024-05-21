import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  HttpCode,
  Query,
  Request,
  Res,
  Req,
  Session,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdataUserPasswordDto } from './dto/update-user.dto';
import { UserPipe } from './user.pipe';
import { throwBusinessError } from '@/common/filter';
import { BUSINESS_HTTP_CODE } from '@/constants/httpCode';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/addGroup')
  addGroup(
    @Body() params: { groups: string[]; uid: string },
    @Session() session,
  ) {
    console.log('params:', params);

    return this.userService.addGroup(params);
  }

  /**
   * @description: create user
   * @return {*}
   */
  @Post()
  async create(@Body(UserPipe) body: CreateUserDto, @Session() session) {
    const { username = '', password = '', code = '' } = body;
    console.log('session:', body);
    if (!code) {
      return throwBusinessError(
        BUSINESS_HTTP_CODE.BUSINESS_ERROR,
        '验证码不能为空',
      );
    }
    if (session.code && code.toLowerCase() !== session.code.toLowerCase()) {
      return throwBusinessError(
        BUSINESS_HTTP_CODE.BUSINESS_ERROR,
        '验证码错误',
      );
    }
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      return throwBusinessError(
        BUSINESS_HTTP_CODE.BUSINESS_ERROR,
        '用户不存在',
      );
    }
    return this.userService.create(body);
  }

  /**
   * @description: update user password
   * @return {*}
   */
  @Post('/changePwd')
  async changePassword(@Body(UserPipe) body: UpdataUserPasswordDto) {
    const { username = '', oldPassword = '', newPassword = '' } = body;
    console.log('session:', body);

    if (!username) {
      return throwBusinessError(
        BUSINESS_HTTP_CODE.BUSINESS_ERROR,
        '用户名不能为空',
      );
    }
    if (oldPassword === newPassword) {
      return throwBusinessError(
        BUSINESS_HTTP_CODE.BUSINESS_ERROR,
        '新密码不能与旧密码相同',
      );
    }
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      return throwBusinessError(
        BUSINESS_HTTP_CODE.BUSINESS_ERROR,
        '用户不存在',
      );
    }
    if (user.password !== oldPassword) {
      return throwBusinessError(BUSINESS_HTTP_CODE.BUSINESS_ERROR, '密码错误');
    }
    return this.userService.update(user.uid, {
      ...user,
      password: newPassword,
    });
  }

  @Get()
  findAll(
    @Query() query: { keyword: string; page: number; size: number },
    @Headers() headers,
  ) {
    const { keyword = '', page = 1, size = 5 } = query;
    return this.userService.findAll({
      keyword,
      page,
      size,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') uid: string) {
    return this.userService.remove(+uid);
  }

  @Get('code')
  createCaptcha(@Req() req, @Res() res, @Session() session) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });
    console.log(req, req.session);

    session.code = captcha.text; //存储验证码记录到session
    // req.session = { ...req.session, code: captcha.text };
    // console.log(req.session);

    res.type('image/svg+xml');
    res.send(captcha.data);
  }
}
