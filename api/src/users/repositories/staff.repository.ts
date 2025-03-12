import { Injectable, Logger } from '@nestjs/common';
import type { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StaffRepository {
  private readonly logger = new Logger(StaffRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    try {
      return this.prisma.staff.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
    } catch (error) {
      this.logger.error("Error finding staff by ID:");
      throw error;
    }
  }

  async findByUserId(userId: string) {
    try {
      return this.prisma.staff.findUnique({
        where: { userId },
        include: {
          user: true,
        },
      });
    } catch (error) {
      this.logger.error("Error finding staff by user ID:" );
      throw error;
    }
  }

  async create(data: {
    userId: string;
    permissions?: Record<string, boolean>;
    department?: string;
    position?: string;
    employeeId?: string;
    hireDate?: Date;
  }) {
    try {
      return this.prisma.staff.create({
        data,
        include: {
          user: true,
        },
      });
    } catch (error) {
      this.logger.error("Error creating staff:" );
      throw error;
    }
  }

  async update(id: string, data: {
    permissions?: Record<string, boolean>;
    department?: string;
    position?: string;
    employeeId?: string;
    hireDate?: Date;
  }) {
    try {
      return this.prisma.staff.update({
        where: { id },
        data,
        include: {
          user: true,
        },
      });
    } catch (error) {
      this.logger.error("Error updating staff:" );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.staff.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error("Error deleting staff:" );
      throw error;
    }
  }

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: StaffRepository;
    orderBy?: StaffRepository;
  }) {
    try {
      const { skip, take, where, orderBy } = options;
      
      return this.prisma.staff.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              isActive: true,
              avatar: true,
              phone: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error("Error finding staff: ");
      throw error;
    }
  }

  async count(options: { where?: StaffRepository }) {
    try {
      const { where } = options;
      
      return this.prisma.staff.count({
        where,
      });
    } catch (error) {
      this.logger.error("Error counting staff:");
      throw error;
    }
  }
}



