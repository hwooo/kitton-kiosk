import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { compare, hash } from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import {
  CreateUserDto,
  LoadUserDto,
} from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly salt = 10;
  
  constructor(
    private userRepository: UserRepository,
  ) {}
  
  async create(dto: CreateUserDto) {
    
  }
  
  async load(dto: LoadUserDto) {
    
  }
  
  async getWithMatchingRefreshToken(userId: number, refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        `refreshToken is empty`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    
    if (!user) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    if (!user.refreshToken) {
      throw new HttpException(
        `user's refreshToken is empty`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const isMatch = await compare(
      refreshToken,
      user.refreshToken,
    );
    
    if (!isMatch) {
      throw new HttpException(
        `expired refreshToken`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    return {
      userId: user.id,
      role: user.role,
      clientVersion: user.clientVersion,
    };
  }
  
  async findByUuidAndPassword(uuid: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
    
    if (!user) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    if (user.password !== password) {
      throw new HttpException(
        `invalid password`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    return user;
  }
  
  async setRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await hash(
      refreshToken,
      this.salt,
    );
    
    await this.userRepository.update(
      {
        id: userId,
      },
      {
        refreshToken: hashedRefreshToken,
      },
    );
  }
}
