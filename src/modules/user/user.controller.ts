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
  forwardRef,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as svgCaptcha from 'svg-captcha';

import { UserService } from './user.service';
import { AuthService } from '@/modules/auth/auth.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdataUserPasswordDto } from './dto/update-user.dto';
import { UserPipe } from './user.pipe';
import { throwBusinessError } from '@/common/filter';
import { BUSINESS_HTTP_CODE } from '@/constants/httpCode';
import { encryptPassword, makeSalt } from '@/utils/cryptogram';
import { AuthStatus, AuthStatusConfig } from '../auth/constants';
import { JwtAuthGuard } from '../auth/auth.guard';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) { }

  @Post('/addGroup')
  addGroup(
    @Body() params: { groups: string[]; uid: string },
    @Session() session,
  ) {
    return this.userService.addGroup(params);
  }

  /**
   * @description: create user
   * @return {*}
   */
  @Post()
  async create(@Body(UserPipe) body: CreateUserDto, @Session() session) {
    const { username = '', password = '', code = '' } = body;
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
    if (user) {
      return throwBusinessError(
        BUSINESS_HTTP_CODE.BUSINESS_ERROR,
        '用户名已被使用',
      );
    }
    // 制作盐
    const salt = makeSalt();
    // 加密
    const hashPwd = encryptPassword(password, salt);
    console.log('password', hashPwd);
    return this.userService.create({
      ...body,
      password: hashPwd,
      salt,
    });
  }

  @Post('/login')
  async userLogin(@Body(UserPipe) body: LoginUserDto) {
    const { username, password } = body;
    const authRes = await this.authService.validateUser(username, password);
    const { status, user } = authRes;
    if (status !== AuthStatus['SUCCESS']) {
      return throwBusinessError(
        BUSINESS_HTTP_CODE.BUSINESS_ERROR,
        AuthStatusConfig[status],
      );
    }
    return this.authService.certificate(user);
  }

  /**
   * @description: update user password
   * @return {*}
   */
  @Post('/changePwd')
  async changePassword(@Body(UserPipe) body: UpdataUserPasswordDto) {
    const { username = '', oldPassword = '', newPassword = '' } = body;

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

  /**
   * @description: find all user
   * @return {*}
   */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Query() query: { keyword: string; page: number; size: number },
    @Request() request,
    @Headers() headers,
  ) {
    console.log('request.user', request.user);

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

    session.code = captcha.text; //存储验证码记录到session
    // req.session = { ...req.session, code: captcha.text };
    // console.log(req.session);

    res.type('image/svg+xml');
    res.send(captcha.data);
  }
}
