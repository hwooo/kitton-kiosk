import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_KEY } from '../common.constant';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  
  canActivate(context: ExecutionContext) {
    const isSkipAuth = this.reflector.getAllAndOverride<boolean[]>(
      SKIP_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!isSkipAuth) {
      return true;
    }
    return super.canActivate(context);
  }
}
