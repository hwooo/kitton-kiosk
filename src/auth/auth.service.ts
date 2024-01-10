import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './interface/auth.interface';
import { UserService } from '@user//user.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginAuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  
  async login({ uuid, password }: LoginAuthDto) {
    const user = await this.userService.findByUuidAndPassword(
      uuid,
      password,
    );
    
    const newRefreshToken = uuidv4();
    
    const payload: JwtPayloadInterface = {
      userId: user.id,
      refreshToken: newRefreshToken,
    };
    
    await this.userService.setRefreshToken(
      user.id,
      newRefreshToken,
    );
    
    return {
      bearerToken: this.jwtService.sign(payload),
    };
  }
}
