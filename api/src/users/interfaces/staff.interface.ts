import type { User } from './user.interface';

export interface Staff {
  id: string;
  userId: string;
  permissions: Record<string, boolean>;
  department?: string;
  position?: string;
  employeeId?: string;
  hireDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface StaffWithUser extends Staff {
  user: User;
}
