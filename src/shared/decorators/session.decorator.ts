import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DSession = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const session = request.session;

    return key ? session && session[key] : session;
  },
);
