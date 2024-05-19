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
} from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPipe } from './user.pipe';

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

  @Post()
  create(@Body(UserPipe) body: CreateUserDto, @Session() session) {
    const { username, password, code } = body;
    if (code.toLowerCase() !== session.code.toLowerCase()) {
      return '验证码错误';
    }
    return this.userService.create(body);
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
