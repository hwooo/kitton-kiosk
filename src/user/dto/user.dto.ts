import {
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  Contains,
} from 'class-validator';
import { UserRole } from '../user.constant';

export class CreateUserDto {
  @IsString()
  clientVersion: string;
  
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.Customer;
  
  @IsString()
  language: string;
}

export class LoadUserDto {
  @IsNumber()
  userId: number;
  
  @IsString()
  @Contains('.')
  clientVersion: string;
}

export class LoadUserOutput {
  id: number;
  uuid: string;
  role: UserRole;
  language: string;
  clientVersion: string;
  clientVersionUpdate: boolean;
}
