import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH_KEY } from '../common.constant';

export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
