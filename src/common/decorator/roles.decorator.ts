import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../common.constant';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
