import { Body, Controller, Post } from '@nestjs/common';
import { SkipAuth } from '@common/decorator/skip-auth.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}
  
  
}
