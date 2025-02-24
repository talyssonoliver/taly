import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";
import type { CreateUserDto } from "../dto/create-user.dto";
import type { UpdateUserDto } from "../dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    if (data.planId) {
      const plan = await this.prisma.plan.findUnique({
        where: { id: data.planId },
      });
      if (!plan) {
        throw new BadRequestException(
          `Plan with ID '${data.planId}' does not exist.`
        );
      }
    }

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role || "USER",
        planId: data.planId || null,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(
        `Cannot update - user with ID '${id}' not found.`
      );
    }

    if (data.planId) {
      const plan = await this.prisma.plan.findUnique({
        where: { id: data.planId },
      });
      if (!plan) {
        throw new BadRequestException(
          `Plan with ID '${data.planId}' does not exist.`
        );
      }
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(
        `Cannot delete - user with ID '${id}' not found.`
      );
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
