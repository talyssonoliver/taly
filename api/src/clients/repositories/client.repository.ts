import { PrismaService } from '../../database/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import type { PrismaService } from '../../database/prisma.service';
import type { CreateClientDto } from '../dto/create-client.dto';
import type { UpdateClientDto } from '../dto/update-client.dto';

@Injectable()
export class ClientRepository {
  private readonly logger = new Logger(ClientRepository.name);

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
      
      return this.prisma.client.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { lastName: 'asc' },
        include: include || {
          salon: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              notes: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error("Error finding clients: ", error);
      throw error;
    }
  }

  async count(options: { where?: any }) {
    try {
      const { where } = options;
      
      return this.prisma.client.count({
        where,
      });
    } catch (error) {
      this.logger.error("Error counting clients: ", error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return this.prisma.client.findUnique({
        where: { id },
        include: {
          salon: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              notes: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error("Error finding client by ID: ", error);
      throw error;
    }
  }

  async findByEmail(email: string, salonId?: string) {
    try {
      return this.prisma.client.findFirst({
        where: {
          email,
          ...(salonId && { salonId }),
        },
      });
    } catch (error) {
      this.logger.error("Error finding client by email: ", error);
      throw error;
    }
  }

  async create(data: CreateClientDto) {
    try {
      return this.prisma.client.create({
        data,
        include: {
          salon: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
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
      this.logger.error("Error creating client: ", error);
      throw error;
    }
  }

  async update(id: string, data: UpdateClientDto) {
    try {
      return this.prisma.client.update({
        where: { id },
        data,
        include: {
          salon: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
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
      this.logger.error("Error updating client: ", error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.client.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error("Error deleting client: ", error);
      throw error;
    }
  }
}



