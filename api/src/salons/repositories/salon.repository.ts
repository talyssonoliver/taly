import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSalonDto } from '../dto/create-salon.dto';
import { UpdateSalonDto } from '../dto/update-salon.dto';

@Injectable()
export class SalonRepository {
  private readonly logger = new Logger(SalonRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
    include?: any;
  }) {
    try {
      const { skip, take, where, orderBy, include } = options;
      
      return this.prisma.salon.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: include || {
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error finding salons: ${error.message}`, error.stack);
      throw error;
    }
  }

  async count(options: { where?: any }) {
    try {
      const { where } = options;
      
      return this.prisma.salon.count({
        where,
      });
    } catch (error) {
      this.logger.error(`Error counting salons: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return this.prisma.salon.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          workingHours: true,
        },
      });
    } catch (error) {
      this.logger.error(`Error finding salon by ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByOwnerId(ownerId: string) {
    try {
      return this.prisma.salon.findMany({
        where: { ownerId },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error finding salons by owner ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(data: CreateSalonDto & { ownerId: string }) {
    try {
      return this.prisma.salon.create({
        data,
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error creating salon: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, data: UpdateSalonDto) {
    try {
      return this.prisma.salon.update({
        where: { id },
        data,
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error updating salon: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.salon.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error deleting salon: ${error.message}`, error.stack);
      throw error;
    }
  }
}



