import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { compare, hash } from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { UserInterface } from './user.interface';
import {
  CreateUserDto,
  LoadUserDto,
  LoadUserOutput,
} from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly salt = 10;
  
  constructor(
    private userRepository: UserRepository,
  ) {}
  
  async create(dto: CreateUserDto) {
    const user = this.userRepository.create();
    
    user.uuid = uuidv4();
    user.password = uuidv4();
    user.role = dto.role;
    user.clientVersion = dto.clientVersion;
    user.language = dto.language;
    
    await this.userRepository.save(user);
    
    return {
      userId: user.id,
      uuid: user.uuid,
      password: user.password,
    };
  }
  
  async load(currentUesr: UserInterface, dto: LoadUserDto): Promise<LoadUserOutput> {
    if (currentUesr.userId !== dto.userId) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const userDetail = await this.userRepository.findOne({
      where: {
        id: currentUesr.userId,
      },
      select: [
        'id',
        'uuid',
        'clientVersion',
        'role',
        'language',
      ],
    });
    
    let hasClientVersionUpdated = false;
    if (dto.clientVersion !== userDetail.clientVersion) {
      await this.userRepository.update(
        { id: currentUesr.userId },
        { clientVersion: dto.clientVersion },
      );
      userDetail.clientVersion = dto.clientVersion;
      hasClientVersionUpdated = true;
    }
    
    return {
      id: userDetail.id,
      uuid: userDetail.uuid,
      role: userDetail.role,
      language: userDetail.language,
      clientVersion: userDetail.clientVersion,
      clientVersionUpdate: hasClientVersionUpdated,
    };
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
