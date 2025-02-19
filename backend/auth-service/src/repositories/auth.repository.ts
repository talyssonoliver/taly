import { Injectable } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return this.prisma.user.create({ data: userData });
  }
}
