import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DUser = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return key ? user && user[key] : user;
  },
);
