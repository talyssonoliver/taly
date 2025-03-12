import { Prisma } from '@prisma/client';

export class PasswordReset implements Prisma.PasswordResetUncheckedCreateInput {
  id?: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}