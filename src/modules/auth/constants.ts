export const jwtConstants = {
  secret: 'wang_wang', // 秘钥
};

export const AuthStatusConfig = {
  SUCCESS: '登录成功',
  ERROR: '用户名或密码错误',
  NOT_FOUND: '用户不存在',
};

export enum AuthStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}
