import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@user/user.constant';
import { ROLES_KEY } from '../common.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!roles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return roles.includes(user.role);
  }
}
