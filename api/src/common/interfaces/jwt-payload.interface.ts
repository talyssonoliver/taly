import { Role } from '../enums/roles.enum';

export interface JwtPayload {
  sub: string; // Subject (userId)
  email: string;
  roles: Role[];
  iat?: number; // Issued at
  exp?: number; // Expiration time
}
