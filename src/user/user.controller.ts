import { Body, Controller, Post } from '@nestjs/common';
import { SkipAuth } from '@common/decorator/skip-auth.decorator';
import { UserService } from './user.service';
import {
  CreateUserDto,
  LoadUserDto,
} from './dto/user.dto';
import { UserInterface } from './user.interface';
import { CurrentUser } from 'common/decorator/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}
  
  @SkipAuth()
  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
  
  @Post('load')
  async load(
    @CurrentUser() currentUser: UserInterface,
    @Body() dto: LoadUserDto,
  ) {
    return this.userService.load(currentUser, dto);
  }
}
