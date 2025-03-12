import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { PaymentProvider } from '../entities/payment.entity';

@Injectable()
export class PaymentRepository {
  private readonly logger = new Logger(PaymentRepository.name);

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
      
      return this.prisma.payment.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: include || {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          appointment: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              status: true,
              service: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
              salon: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          refunds: true,
        },
      });
    } catch (error) {
      this.logger.error(Error finding payments: );
      throw error;
    }
  }

  async count(options: { where?: any }) {
    try {
      const { where } = options;
      
      return this.prisma.payment.count({
        where,
      });
    } catch (error) {
      this.logger.error(Error counting payments: );
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return this.prisma.payment.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          appointment: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              status: true,
              service: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
              salon: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          refunds: true,
          transactions: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(Error finding payment by ID: );
      throw error;
    }
  }

  async findByAppointmentId(appointmentId: string) {
    try {
      return this.prisma.payment.findFirst({
        where: { appointmentId },
        include: {
          refunds: true,
        },
      });
    } catch (error) {
      this.logger.error(Error finding payment by appointment ID: );
      throw error;
    }
  }

  async findByTransactionId(transactionId: string) {
    try {
      return this.prisma.payment.findFirst({
        where: { transactionId },
      });
    } catch (error) {
      this.logger.error(Error finding payment by transaction ID: );
      throw error;
    }
  }

  async create(data: {
    userId: string;
    appointmentId: string;
    amount: number;
    status?: PaymentStatus;
    provider?: PaymentProvider;
    paymentMethod?: string;
    description?: string;
  }) {
    try {
      return this.prisma.payment.create({
        data,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          appointment: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              status: true,
              service: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
              salon: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(Error creating payment: );
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      return this.prisma.payment.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          appointment: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              status: true,
              service: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
              salon: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          refunds: true,
        },
      });
    } catch (error) {
      this.logger.error(Error updating payment: );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.payment.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(Error deleting payment: );
      throw error;
    }
  }

  async findPendingPayments() {
    try {
      return this.prisma.payment.findMany({
        where: {
          status: PaymentStatus.PENDING,
          createdAt: {
            lte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Older than 24 hours
          },
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
          appointment: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              status: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(Error finding pending payments: );
      throw error;
    }
  }
}



