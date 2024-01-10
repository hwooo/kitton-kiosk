import { IsString, IsEnum, IsOptional, Contains } from 'class-validator';
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
  @IsString()
  @Contains('.')
  clientVersion: string;
}
