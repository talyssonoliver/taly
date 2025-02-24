import type { Prisma } from "@prisma/client";
import type { CreateUserDTO } from "../shared/dto/create-user.dto";

export interface IAuthRepository {
  findByEmail(email: string): Promise<Prisma.User | null>;
  createUser(user: CreateUserDTO): Promise<Prisma.User>;
}
