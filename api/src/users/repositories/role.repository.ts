import { Injectable, Logger } from '@nestjs/common';
import type { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RoleRepository {
  private readonly logger = new Logger(RoleRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    try {
      return this.prisma.role.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error finding role by ID: ${error.message}`);
      throw error;
    }
  }

  async findByName(name: string) {
    try {
      return this.prisma.role.findUnique({
        where: { name },
      });
    } catch (error) {
      this.logger.error(`Error finding role by name: ${error.message}`);
      throw error;
    }
  }

  async create(data: {
    name: string;
    description?: string;
    permissions?: Record<string, boolean>;
  }) {
    try {
      return this.prisma.role.create({
        data,
      });
    } catch (error) {
      this.logger.error(`Error creating role: ${error.message}` );
      throw error;
    }
  }

  async update(id: string, data: {
    name?: string;
    description?: string;
    permissions?: Record<string, boolean>;
  }) {
    try {
      return this.prisma.role.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(`Error updating role: ${error.message}` );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.role.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error deleting role: ${error.message}`);
      throw error;
    }
  }

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    try {
      const { skip, take, where, orderBy } = options;
      
      return this.prisma.role.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error finding role: ${error.message}`);
      throw error;
    }
  }

  async count(options: { where?: any }) {
    try {
      const { where } = options;
      
      return this.prisma.role.count({
        where,
      });
    } catch (error) {
      this.logger.error(`Error coounting role: ${error.message}`);
    }
  }
}



