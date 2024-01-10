import { Body, Controller, Post } from '@nestjs/common';
import { SkipAuth } from '@common/decorator/skip-auth.decorator';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}
  
  @SkipAuth()
  @Post('login')
  async login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }
}
