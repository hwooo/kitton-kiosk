import { Body, Controller, Post } from '@nestjs/common';
import { SkipAuth } from '@common/decorator/skip-auth.decorator';
import { UserService } from './user.service';
import {
  CreateUserDto,
  LoadUserDto,
} from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}
  
  @Post('create')
  @SkipAuth()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
