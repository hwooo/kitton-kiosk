import { UserRole } from './user.constant';

export interface UserInterface {
  userId: number;
  role: UserRole;
  clientVersion: string;
}
