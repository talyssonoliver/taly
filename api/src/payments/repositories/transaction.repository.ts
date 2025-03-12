import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TransactionType, TransactionStatus } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  private readonly logger = new Logger(TransactionRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    try {
      const { skip, take, where, orderBy } = options;
      
      return this.prisma.transaction.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              provider: true,
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
      this.logger.error(Error finding transactions: );
      throw error;
    }
  }

  async count(options: { where?: any }) {
    try {
      const { where } = options;
      
      return this.prisma.transaction.count({
        where,
      });
    } catch (error) {
      this.logger.error(Error counting transactions: );
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return this.prisma.transaction.findUnique({
        where: { id },
        include: {
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              provider: true,
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
      this.logger.error(Error finding transaction by ID: );
      throw error;
    }
  }

  async findByPaymentId(paymentId: string) {
    try {
      return this.prisma.transaction.findMany({
        where: { paymentId },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
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
      this.logger.error(Error finding transactions by payment ID: );
      throw error;
    }
  }

  async create(data: {
    paymentId: string;
    userId: string;
    amount: number;
    type: string;
    status: string;
    providerTransactionId?: string;
    providerResponse?: string;
  }) {
    try {
      return this.prisma.transaction.create({
        data,
        include: {
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              provider: true,
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
      this.logger.error(Error creating transaction: );
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      return this.prisma.transaction.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(Error updating transaction: );
      throw error;
    }
  }
}



