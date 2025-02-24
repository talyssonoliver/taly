import { Injectable } from "@nestjs/common";
import type { User } from "@prisma/client";
import type { PrismaService } from "../prisma/prisma.service";
import type { IAuthRepository } from "./IAuthRepository";
import type { CreateUserDto } from "../../../user-service/src/dto/create-user.dto";

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
      },
    });
  }
}
