import { IsUUID } from 'class-validator';

export class LoginAuthDto {
  @IsUUID('4')
  uuid: string;
  
  @IsUUID('4')
  password: string;
}
