import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { PaymentRepository } from './repositories/payment.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { PaymentMethodRepository } from './repositories/payment-method.repository';
import { PaymentFactory } from './providers/payment-factory';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { PaymentProvider } from './interfaces/payment-provider.interface';
import { PaginationUtil } from '../common/utils/pagination.util';
import { NotificationsService } from '../notifications/notifications.service';
import { PAYMENT_CONSTANTS } from './constants/payment.constants';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentRepository: PaymentRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly paymentFactory: PaymentFactory,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    @Inject('PAYMENT_PROVIDERS') private readonly paymentProviders: Record<string, PaymentProvider>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    options: {
      status?: PaymentStatus;
    } = {},
  ) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      const { status } = options;
      
      // Build filter
      const where: any = {};
      
      if (status) {
        where.status = status;
      }
      
      const [payments, total] = await Promise.all([
        this.paymentRepository.findMany({ skip, take, where }),
        this.paymentRepository.count({ where }),
      ]);
      
      return PaginationUtil.createPaginatedResult(payments, total, page, limit);
    } catch (error) {
      this.logger.error(`Error finding all payments: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve payments');
    }
  }

  async findById(id: string) {
    try {
      const payment = await this.paymentRepository.findById(id);
      
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      
      return payment;
    } catch (error) {
      this.logger.error(`Error finding payment by ID: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to retrieve payment');
    }
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      
      const where = { userId };
      
      const [payments, total] = await Promise.all([
        this.paymentRepository.findMany({
          skip,
          take,
          where,
          orderBy: { createdAt: 'desc' },
        }),
        this.paymentRepository.count({ where }),
      ]);
      
      return PaginationUtil.createPaginatedResult(payments, total, page, limit);
    } catch (error) {
      this.logger.error(`Error finding payments for user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve user payments');
    }
  }

  async create(createPaymentDto: CreatePaymentDto, userId: string) {
    try {
      const { appointmentId, amount, paymentMethod, provider } = createPaymentDto;
      
      // Verify appointment exists and belongs to the user
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          salon: true,
          service: true,
          client: true,
        },
      });
      
      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
      }
      
      // Check if the user is the client or salon owner
      const salon = await this.prisma.salon.findUnique({
        where: { id: appointment.salonId },
      });
      
      if (salon.ownerId !== userId && appointment.client.userId !== userId) {
        throw new UnauthorizedException('You are not authorized to create a payment for this appointment');
      }
      
      // Check if payment already exists for this appointment
      const existingPayment = await this.paymentRepository.findByAppointmentId(appointmentId);
      
      if (existingPayment) {
        throw new ConflictException(`Payment already exists for appointment ${appointmentId}`);
      }
      
      // Calculate payment amount if not provided
      const paymentAmount = amount || appointment.service.price;
      
      // Validate provider
      if (!this.paymentProviders[provider]) {
        throw new BadRequestException(`Payment provider ${provider} is not supported`);
      }
      
      // Create payment
      const payment = await this.paymentRepository.create({
        userId,
        appointmentId,
        amount: paymentAmount,
        status: PaymentStatus.PENDING,
        paymentMethod,
        provider,
        description: `Payment for ${appointment.service.name} at ${appointment.salon.name}`,
      });
      
      return payment;
    } catch (error) {
      this.logger.error(`Error creating payment: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || 
          error instanceof UnauthorizedException || 
          error instanceof ConflictException || 
          error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to create payment');
    }
  }

  async process(processPaymentDto: ProcessPaymentDto, userId: string) {
    try {
      const { paymentId, paymentMethodId, token, cardDetails } = processPaymentDto;
      
      // Get payment
      const payment = await this.findById(paymentId);
      
      // Check if the user is authorized to process this payment
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: payment.appointmentId },
        include: {
          salon: true,
          client: true,
        },
      });
      
      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${payment.appointmentId} not found`);
      }
      
      const salon = appointment.salon;
      const isClientOrOwner = appointment.client.userId === userId || salon.ownerId === userId;
      
      if (!isClientOrOwner) {
        throw new UnauthorizedException('You are not authorized to process this payment');
      }
      
      // Check if payment is already processed
      if (payment.status === PaymentStatus.COMPLETED) {
        throw new BadRequestException('Payment has already been processed');
      }
      
      if (payment.status === PaymentStatus.REFUNDED) {
        throw new BadRequestException('Payment has been refunded and cannot be processed');
      }
      
      // Validate payment method
      if (!paymentMethodId && !token && !cardDetails) {
        throw new BadRequestException('Payment method, token, or card details required');
      }
      
      // Get payment provider
      const provider = this.paymentFactory.createProvider(payment.provider);
      
      if (!provider) {
        throw new BadRequestException(`Payment provider ${payment.provider} is not available`);
      }
      
      // Process payment
      let paymentResult;
      
      if (paymentMethodId) {
        // Process with saved payment method
        const paymentMethod = await this.paymentMethodRepository.findById(paymentMethodId);
        
        if (!paymentMethod) {
          throw new NotFoundException(`Payment method with ID ${paymentMethodId} not found`);
        }
        
        if (paymentMethod.userId !== userId) {
          throw new UnauthorizedException('You are not authorized to use this payment method');
        }
        
        paymentResult = await provider.processPaymentWithSavedMethod(
          payment.id,
          payment.amount,
          paymentMethod.token,
          payment.description,
        );
      } else if (token) {
        // Process with token
        paymentResult = await provider.processPaymentWithToken(
          payment.id,
          payment.amount,
          token,
          payment.description,
        );
      } else if (cardDetails) {
        // Process with card details
        paymentResult = await provider.processPaymentWithCard(
          payment.id,
          payment.amount,
          cardDetails,
          payment.description,
        );
      }
      
      // Update payment with result
      const updatedPayment = await this.paymentRepository.update(paymentId, {
        status: PaymentStatus.COMPLETED,
        transactionId: paymentResult.transactionId,
        processedAt: new Date(),
        providerId: paymentResult.providerId || null,
      });
      
      // Create transaction record
      const transaction = await this.transactionRepository.create({
        paymentId,
        userId,
        amount: payment.amount,
        type: 'PAYMENT',
        status: 'SUCCESS',
        providerTransactionId: paymentResult.transactionId,
        providerResponse: JSON.stringify(paymentResult.response || {}),
      });
      
      // Save card as payment method if requested
      if (processPaymentDto.saveCard && token) {
        try {
          await this.addPaymentMethod(
            {
              type: 'CARD',
              token,
              provider: payment.provider,
              isDefault: true,
            },
            userId,
          );
        } catch (error) {
          this.logger.error(`Failed to save payment method: ${error.message}`, error.stack);
          // Don't fail the whole transaction if we can't save the payment method
        }
      }
      
      // Send payment confirmation notification
      try {
        await this.notificationsService.sendPaymentConfirmation(
          updatedPayment,
          appointment.client,
          appointment
        );
      } catch (notificationError) {
        this.logger.error(`Failed to send payment notification: ${notificationError.message}`, notificationError.stack);
        // Don't fail the transaction if notification fails
      }
      
      return {
        ...updatedPayment,
        transaction,
      };
    } catch (error) {
      this.logger.error(`Error processing payment: ${error.message}`, error.stack);
      
      // Create failed transaction record if payment exists
      try {
        if (processPaymentDto.paymentId) {
          await this.transactionRepository.create({
            paymentId: processPaymentDto.paymentId,
            userId,
            amount: (await this.findById(processPaymentDto.paymentId))?.amount || 0,
            type: 'PAYMENT',
            status: 'FAILED',
            providerResponse: JSON.stringify({ error: error.message }),
          });
          
          // Update payment status to failed
          await this.paymentRepository.update(processPaymentDto.paymentId, {
            status: PaymentStatus.FAILED,
            errorMessage: error.message,
          });
        }
      } catch (recordError) {
        this.logger.error(`Error recording failed transaction: ${recordError.message}`, recordError.stack);
      }
      
      // Re-throw specific errors
      if (error instanceof NotFoundException ||
          error instanceof BadRequestException ||
          error instanceof UnauthorizedException ||
          error instanceof ConflictException) {
        throw error;
      }
      
      // Generic error
      throw new InternalServerErrorException('Failed to process payment');
    }
  }

  async refund(refundPaymentDto: RefundPaymentDto, userId: string) {
    try {
      const { paymentId, amount, reason } = refundPaymentDto;
      
      // Get payment
      const payment = await this.findById(paymentId);
      
      // Check if the user is authorized to refund this payment
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: payment.appointmentId },
        include: {
          salon: true,
        },
      });
      
      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${payment.appointmentId} not found`);
      }
      
      // Only salon owner can refund payments
      if (appointment.salon.ownerId !== userId) {
        throw new UnauthorizedException('Only salon owners can process refunds');
      }
      
      // Check if payment can be refunded
      if (payment.status !== PaymentStatus.COMPLETED) {
        throw new BadRequestException(`Payment with status ${payment.status} cannot be refunded`);
      }
      
      if (!payment.transactionId) {
        throw new BadRequestException('Payment has no transaction ID');
      }
      
      // Calculate refund amount
      const refundAmount = amount || payment.amount;
      
      if (refundAmount <= 0) {
        throw new BadRequestException('Refund amount must be greater than 0');
      }
      
      if (refundAmount > payment.amount) {
        throw new BadRequestException('Refund amount cannot exceed payment amount');
      }
      
      // Get payment provider
      const provider = this.paymentFactory.createProvider(payment.provider);
      
      if (!provider) {
        throw new BadRequestException(`Payment provider ${payment.provider} is not available`);
      }
      
      // Process refund
      const refundResult = await provider.refundPayment(
        payment.transactionId,
        refundAmount,
        reason || 'Customer requested refund',
      );
      
      // Use transaction to ensure consistency
      return this.prisma.$transaction(async (prisma) => {
        // Create refund record
        const refund = await prisma.refund.create({
          data: {
            paymentId,
            amount: refundAmount,
            reason: reason || 'Customer requested refund',
            transactionId: refundResult.transactionId,
            refundedBy: userId,
          },
        });
        
        // Update payment status
        const isFullRefund = refundAmount >= payment.amount;
        const updatedPayment = await this.paymentRepository.update(paymentId, {
          status: isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
          refundedAmount: refundAmount,
          refundedAt: new Date(),
        });
        
        // Create transaction record
        await this.transactionRepository.create({
          paymentId,
          userId,
          amount: refundAmount,
          type: 'REFUND',
          status: 'SUCCESS',
          providerTransactionId: refundResult.transactionId,
          providerResponse: JSON.stringify(refundResult.response || {}),
        });
        
        // Update appointment status if full refund
        if (isFullRefund) {
          await prisma.appointment.update({
            where: { id: payment.appointmentId },
            data: {
              status: 'CANCELLED',
            },
          });
        }
        
        // Send refund notification
        try {
          await this.notificationsService.sendRefundNotification(
            updatedPayment,
            refund,
            appointment
          );
        } catch (notificationError) {
          this.logger.error(`Failed to send refund notification: ${notificationError.message}`, notificationError.stack);
          // Don't fail the transaction if notification fails
        }
        
        return {
          ...updatedPayment,
          refund,
        };
      });
    } catch (error) {
      this.logger.error(`Error refunding payment: ${error.message}`, error.stack);
      
      // Re-throw specific errors
      if (error instanceof NotFoundException ||
          error instanceof BadRequestException ||
          error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Generic error
      throw new InternalServerErrorException('Failed to process refund');
    }
  }

  async addPaymentMethod(paymentMethodDto: PaymentMethodDto, userId: string) {
    try {
      const { type, token, provider, isDefault } = paymentMethodDto;
      
      // Validate input
      if (!type || !token || !provider) {
        throw new BadRequestException('Type, token, and provider are required');
      }
      
      // Check if provider is supported
      if (!this.paymentProviders[provider]) {
        throw new BadRequestException(`Payment provider ${provider} is not supported`);
      }
      
      // Get payment provider
      const paymentProvider = this.paymentFactory.createProvider(provider);
      
      // Validate token with provider
      const tokenInfo = await paymentProvider.validateToken(token);
      
      if (!tokenInfo) {
        throw new BadRequestException('Invalid payment token');
      }
      
      // Create payment method
      const paymentMethod = await this.paymentMethodRepository.create({
        userId,
        type,
        token,
        provider,
        isDefault: isDefault || false,
        lastFour: tokenInfo.lastFour,
        expiryMonth: tokenInfo.expiryMonth,
        expiryYear: tokenInfo.expiryYear,
        cardBrand: tokenInfo.cardBrand,
      });
      
      // If default, update other payment methods
      if (isDefault) {
        await this.paymentMethodRepository.setDefaultPaymentMethod(userId, paymentMethod.id);
      }
      
      return paymentMethod;
    } catch (error) {
      this.logger.error(`Error adding payment method: ${error.message}`, error.stack);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to add payment method');
    }
  }

  async getPaymentMethods(userId: string) {
    try {
      const methods = await this.paymentMethodRepository.findByUserId(userId);
      
      // Map methods to safe response objects without tokens
      return methods.map(method => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { token, ...safeMethod } = method;
        return safeMethod;
      });
    } catch (error) {
      this.logger.error(`Error getting payment methods: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve payment methods');
    }
  }

  async getPaymentMethodById(id: string, userId: string) {
    try {
      const method = await this.paymentMethodRepository.findById(id);
      
      if (!method) {
        throw new NotFoundException(`Payment method with ID ${id} not found`);
      }
      
      // Check if user owns the payment method
      if (method.userId !== userId) {
        throw new UnauthorizedException('You are not authorized to access this payment method');
      }
      
      // Remove token for security
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { token, ...safeMethod } = method;
      
      return safeMethod;
    } catch (error) {
      this.logger.error(`Error getting payment method: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to retrieve payment method');
    }
  }

  async deletePaymentMethod(id: string, userId: string) {
    try {
      const paymentMethod = await this.paymentMethodRepository.findById(id);
      
      if (!paymentMethod) {
        throw new NotFoundException(`Payment method with ID ${id} not found`);
      }
      
      if (paymentMethod.userId !== userId) {
        throw new UnauthorizedException('You are not authorized to delete this payment method');
      }
      
      // Delete the payment method
      const deletedMethod = await this.paymentMethodRepository.delete(id);
      
      // If it was the default, set another one as default if available
      if (paymentMethod.isDefault) {
        const methods = await this.paymentMethodRepository.findByUserId(userId);
        
        if (methods.length > 0) {
          await this.paymentMethodRepository.update(methods[0].id, { isDefault: true });
        }
      }
      
      return deletedMethod;
    } catch (error) {
      this.logger.error(`Error deleting payment method: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to delete payment method');
    }
  }

  async handleStripeWebhook(event: any) {
    try {
      this.logger.log(`Processing Stripe webhook: ${event.type}`);
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          return this.handleStripePaymentSuccess(event.data.object);
        
        case 'payment_intent.payment_failed':
          return this.handleStripePaymentFailure(event.data.object);
        
        case 'charge.refunded':
          return this.handleStripeRefund(event.data.object);
        
        default:
          this.logger.log(`Unhandled Stripe event type: ${event.type}`);
          return { received: true };
      }
    } catch (error) {
      this.logger.error(`Error handling Stripe webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  async handlePaypalWebhook(event: any) {
    try {
      this.logger.log(`Processing PayPal webhook: ${event.event_type}`);
      
      switch (event.event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          return this.handlePaypalPaymentSuccess(event.resource);
        
        case 'PAYMENT.CAPTURE.DENIED':
          return this.handlePaypalPaymentFailure(event.resource);
        
        case 'PAYMENT.CAPTURE.REFUNDED':
          return this.handlePaypalRefund(event.resource);
        
        default:
          this.logger.log(`Unhandled PayPal event type: ${event.event_type}`);
          return { received: true };
      }
    } catch (error) {
      this.logger.error(`Error handling PayPal webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Private webhook handler methods
  private async handleStripePaymentSuccess(paymentIntent: any) {
    try {
      const paymentId = paymentIntent.metadata?.paymentId;
      
      if (!paymentId) {
        this.logger.warn('No payment ID in Stripe payment intent metadata');
        return { received: true };
      }
      
      const payment = await this.findById(paymentId);
      
      if (!payment) {
        this.logger.warn(`Payment with ID ${paymentId} not found`);
        return { received: true };
      }
      
      if (payment.status === PaymentStatus.COMPLETED) {
        this.logger.log(`Payment ${paymentId} already marked as completed`);
        return { received: true };
      }
      
      // Update payment status
      await this.paymentRepository.update(paymentId, {
        status: PaymentStatus.COMPLETED,
        transactionId: paymentIntent.id,
        processedAt: new Date(),
        providerId: paymentIntent.id,
      });
      
      // Create transaction record
      await this.transactionRepository.create({
        paymentId,
        userId: payment.userId,
        amount: payment.amount,
        type: 'PAYMENT',
        status: 'SUCCESS',
        providerTransactionId: paymentIntent.id,
        providerResponse: JSON.stringify(paymentIntent),
      });
      
      // Send notification
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: payment.appointmentId },
        include: {
          client: true,
          salon: true,
          service: true,
        },
      });
      
      if (appointment) {
        try {
          await this.notificationsService.sendPaymentConfirmation(
            payment,
            appointment.client,
            appointment
          );
        } catch (notificationError) {
          this.logger.error(`Failed to send payment webhook notification: ${notificationError.message}`);
        }
      }
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Error handling Stripe payment success: ${error.message}`, error.stack);
      return { error: error.message };
    }
  }

  private async handleStripePaymentFailure(paymentIntent: any) {
    try {
      const paymentId = paymentIntent.metadata?.paymentId;
      
      if (!paymentId) {
        this.logger.warn('No payment ID in Stripe payment intent metadata');
        return { received: true };
      }
      
      const payment = await this.findById(paymentId);
      
      if (!payment) {
        this.logger.warn(`Payment with ID ${paymentId} not found`);
        return { received: true };
      }
      
      // Update payment status
      await this.paymentRepository.update(paymentId, {
        status: PaymentStatus.FAILED,
        errorMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
      });
      
      // Create transaction record
      await this.transactionRepository.create({
        paymentId,
        userId: payment.userId,
        amount: payment.amount,
        type: 'PAYMENT',
        status: 'FAILED',
        providerTransactionId: paymentIntent.id,
        providerResponse: JSON.stringify(paymentIntent),
      });
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Error handling Stripe payment failure: ${error.message}`, error.stack);
      return { error: error.message };
    }
  }

  private async handleStripeRefund(charge: any) {
    try {
      // Find payment by transaction ID
      const payment = await this.paymentRepository.findByTransactionId(charge.payment_intent);
      
      if (!payment) {
        this.logger.warn(`Payment with transaction ID ${charge.payment_intent} not found`);
        return { received: true };
      }
      
      // Calculate refund amount
      const refundAmount = charge.amount_refunded / 100; // Stripe amounts are in cents
      const isFullRefund = refundAmount >= payment.amount;
      
      // Update payment status
      await this.paymentRepository.update(payment.id, {
        status: isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
        refundedAmount: refundAmount,
        refundedAt: new Date(),
      });
      
      // Create refund record
      await this.prisma.refund.create({
        data: {
          paymentId: payment.id,
          amount: refundAmount,
          reason: 'Refund via Stripe webhook',
          transactionId: charge.refunds.data[0].id,
          refundedBy: payment.userId, // Default to user, admin can update later
        },
      });
      
      // Update appointment status if full refund
      if (isFullRefund) {
        await this.prisma.appointment.update({
          where: { id: payment.appointmentId },
          data: {
            status: 'CANCELLED',
          },
        });
      }
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Error handling Stripe refund: ${error.message}`, error.stack);
      return { error: error.message };
    }
  }

  private async handlePaypalPaymentSuccess(resource: any) {
    try {
      const paymentId = resource.custom_id;
      
      if (!paymentId) {
        this.logger.warn('No payment ID in PayPal resource custom_id');
        return { received: true };
      }
      
      const payment = await this.findById(paymentId);
      
      if (!payment) {
        this.logger.warn(`Payment with ID ${paymentId} not found`);
        return { received: true };
      }
      
      if (payment.status === PaymentStatus.COMPLETED) {
        this.logger.log(`Payment ${paymentId} already marked as completed`);
        return { received: true };
      }
      
      // Update payment status
      await this.paymentRepository.update(paymentId, {
        status: PaymentStatus.COMPLETED,
        transactionId: resource.id,
        processedAt: new Date(),
        providerId: resource.id,
      });
      
      // Create transaction record
      await this.transactionRepository.create({
        paymentId,
        userId: payment.userId,
        amount: payment.amount,
        type: 'PAYMENT',
        status: 'SUCCESS',
        providerTransactionId: resource.id,
        providerResponse: JSON.stringify(resource),
      });
      
      // Send notification
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: payment.appointmentId },
        include: {
          client: true,
          salon: true,
          service: true,
        },
      });
      
      if (appointment) {
        try {
          await this.notificationsService.sendPaymentConfirmation(
            payment,
            appointment.client,
            appointment
          );
        } catch (notificationError) {
          this.logger.error(`Failed to send PayPal payment webhook notification: ${notificationError.message}`);
        }
      }
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Error handling PayPal payment success: ${error.message}`, error.stack);
      return { error: error.message };
    }
  }

  private async handlePaypalPaymentFailure(resource: any) {
    try {
      const paymentId = resource.custom_id;
      
      if (!paymentId) {
        this.logger.warn('No payment ID in PayPal resource custom_id');
        return { received: true };
      }
      
      const payment = await this.findById(paymentId);
      
      if (!payment) {
        this.logger.warn(`Payment with ID ${paymentId} not found`);
        return { received: true };
      }
      
      // Update payment status
      await this.paymentRepository.update(paymentId, {
        status: PaymentStatus.FAILED,
        errorMessage: resource.status_details?.reason || 'Payment failed',
      });
      
      // Create transaction record
      await this.transactionRepository.create({
        paymentId,
        userId: payment.userId,
        amount: payment.amount,
        type: 'PAYMENT',
        status: 'FAILED',
        providerTransactionId: resource.id,
        providerResponse: JSON.stringify(resource),
      });
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Error handling PayPal payment failure: ${error.message}`, error.stack);
      return { error: error.message };
    }
  }

  private async handlePaypalRefund(resource: any) {
    try {
      // Find payment by transaction ID
      const paymentLinks = resource.links.find(l => l.rel === 'up');
      const originalPaymentId = paymentLinks ? paymentLinks.href.split('/').pop() : null;
      
      if (!originalPaymentId) {
        this.logger.warn('Payment not found for PayPal refund - missing original payment ID');
        return { received: true };
      }
      
      const payment = await this.paymentRepository.findByTransactionId(originalPaymentId);
      
      if (!payment) {
        this.logger.warn(`Payment not found for PayPal refund with transaction ID ${originalPaymentId}`);
        return { received: true };
      }
      
      // Calculate refund amount
      const refundAmount = parseFloat(resource.amount.value);
      const isFullRefund = refundAmount >= payment.amount;
      
      // Update payment status
      await this.paymentRepository.update(payment.id, {
        status: isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
        refundedAmount: refundAmount,
        refundedAt: new Date(),
      });
      
      // Create refund record
      await this.prisma.refund.create({
        data: {
          paymentId: payment.id,
          amount: refundAmount,
          reason: 'Refund via PayPal webhook',
          transactionId: resource.id,
          refundedBy: payment.userId, // Default to user, admin can update later
        },
      });
      
      // Update appointment status if full refund
      if (isFullRefund) {
        await this.prisma.appointment.update({
          where: { id: payment.appointmentId },
          data: {
            status: 'CANCELLED',
          },
        });
      }
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Error handling PayPal refund: ${error.message}`, error.stack);
      return { error: error.message };
    }
  }
}