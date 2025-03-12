import type { Role } from '../../common/enums/roles.enum';

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  role: Role;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  address?: string;
  provider?: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {
  fullName?: string;
}
