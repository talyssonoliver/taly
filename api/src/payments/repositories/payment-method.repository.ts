import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PaymentMethodType } from '../entities/payment-method.entity';
import { PaymentProvider } from '../entities/payment.entity';

@Injectable()
export class PaymentMethodRepository {
  private readonly logger = new Logger(PaymentMethodRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    try {
      const { skip, take, where, orderBy } = options;
      
      return this.prisma.paymentMethod.findMany({
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
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(Error finding payment methods: );
      throw error;
    }
  }

  async count(options: { where?: any }) {
    try {
      const { where } = options;
      
      return this.prisma.paymentMethod.count({
        where,
      });
    } catch (error) {
      this.logger.error(Error counting payment methods: );
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return this.prisma.paymentMethod.findUnique({
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
        },
      });
    } catch (error) {
      this.logger.error(Error finding payment method by ID: );
      throw error;
    }
  }

  async findByUserId(userId: string) {
    try {
      return this.prisma.paymentMethod.findMany({
        where: { userId },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    } catch (error) {
      this.logger.error(Error finding payment methods by user ID: );
      throw error;
    }
  }

  async findDefaultByUserId(userId: string) {
    try {
      return this.prisma.paymentMethod.findFirst({
        where: {
          userId,
          isDefault: true,
        },
      });
    } catch (error) {
      this.logger.error(Error finding default payment method: );
      throw error;
    }
  }

  async create(data: {
    userId: string;
    type: string;
    provider: string;
    token: string;
    isDefault?: boolean;
    lastFour?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cardBrand?: string;
  }) {
    try {
      return this.prisma.paymentMethod.create({
        data,
      });
    } catch (error) {
      this.logger.error(Error creating payment method: );
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      return this.prisma.paymentMethod.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(Error updating payment method: );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.paymentMethod.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(Error deleting payment method: );
      throw error;
    }
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    try {
      // First, set all payment methods for this user to non-default
      await this.prisma.paymentMethod.updateMany({
        where: {
          userId,
          id: {
            not: paymentMethodId,
          },
        },
        data: {
          isDefault: false,
        },
      });
      
      // Then, set the specified payment method as default
      return this.prisma.paymentMethod.update({
        where: { id: paymentMethodId },
        data: {
          isDefault: true,
        },
      });
    } catch (error) {
      this.logger.error(Error setting default payment method: );
      throw error;
    }
  }
}



