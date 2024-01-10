import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtConstants } from '../auth.constant';
import { JwtPayloadInterface } from '../interface/auth.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstants.secretKey,
    });
  }
  
  async validate(payload: JwtPayloadInterface): Promise<any> {
    if (!payload) {
      throw new HttpException(
        `payload is empty`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    if (!payload.userId || !payload.refreshToken) {
      throw new HttpException(
        `invalid jwt payload`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const user = await this.userService.getWithMatchingRefreshToken(
      payload.userId,
      payload.refreshToken,
    );
    
    if (!user) {
      throw new HttpException(
        `cannot find user with refreshToken`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    return user;
  }
}
