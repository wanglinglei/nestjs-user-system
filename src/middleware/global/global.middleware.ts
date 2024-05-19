// 全局中间件 只能是一个函数 不能是class

import { Response, Request, NextFunction } from 'express';
const whiteList = [];

export function GlobalMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('全局中间件', req.originalUrl);
  if (whiteList.includes(req.originalUrl)) {
    next();
  } else {
    next();
  }
}
