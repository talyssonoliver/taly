import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/roles.enum';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@Resolver('Payment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query('payments')
  @Roles(Role.ADMIN)
  async getPayments(
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
    @Args('status', { nullable: true }) status?: PaymentStatus,
  ) {
    return this.paymentsService.findAll(page, limit, { status });
  }

  @Query('payment')
  async getPayment(
    @Args('id') id: string,
    @CurrentUser() user,
  ) {
    const payment = await this.paymentsService.findById(id);
    
    if (!payment) {
      throw new Error(Payment with ID  not found);
    }
    
    // Check if user is authorized to view this payment
    if (payment.userId !== user.id && user.role !== Role.ADMIN && user.role !== Role.STAFF) {
      throw new Error('You are not authorized to view this payment');
    }
    
    return payment;
  }

  @Query('userPayments')
  @Roles(Role.ADMIN, Role.STAFF)
  async getUserPayments(
    @Args('userId') userId: string,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.paymentsService.findByUserId(userId, page, limit);
  }

  @Query('myPayments')
  async getMyPayments(
    @CurrentUser() user,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.paymentsService.findByUserId(user.id, page, limit);
  }

  @Mutation('createPayment')
  async createPayment(
    @Args('input') createPaymentDto: CreatePaymentDto,
    @CurrentUser() user,
  ) {
    return this.paymentsService.create(createPaymentDto, user.id);
  }

  @Mutation('processPayment')
  async processPayment(
    @Args('input') processPaymentDto: ProcessPaymentDto,
    @CurrentUser() user,
  ) {
    const payment = await this.paymentsService.findById(processPaymentDto.paymentId);
    
    if (!payment) {
      throw new Error(Payment with ID  not found);
    }
    
    // Check if user is authorized to process this payment
    if (payment.userId !== user.id && user.role !== Role.ADMIN && user.role !== Role.STAFF) {
      throw new Error('You are not authorized to process this payment');
    }
    
    return this.paymentsService.process(processPaymentDto, user.id);
  }

  @Mutation('refundPayment')
  @Roles(Role.ADMIN, Role.STAFF)
  async refundPayment(
    @Args('input') refundPaymentDto: RefundPaymentDto,
    @CurrentUser() user,
  ) {
    return this.paymentsService.refund(refundPaymentDto, user.id);
  }

  @Mutation('addPaymentMethod')
  async addPaymentMethod(
    @Args('input') paymentMethodDto: PaymentMethodDto,
    @CurrentUser() user,
  ) {
    return this.paymentsService.addPaymentMethod(paymentMethodDto, user.id);
  }

  @Query('paymentMethods')
  async getPaymentMethods(@CurrentUser() user) {
    return this.paymentsService.getPaymentMethods(user.id);
  }

  @Query('paymentMethod')
  async getPaymentMethod(
    @Args('id') id: string,
    @CurrentUser() user,
  ) {
    const paymentMethod = await this.paymentsService.getPaymentMethodById(id);
    
    if (!paymentMethod) {
      throw new Error(Payment method with ID  not found);
    }
    
    // Check if user is authorized to access this payment method
    if (paymentMethod.userId !== user.id && user.role !== Role.ADMIN) {
      throw new Error('You are not authorized to access this payment method');
    }
    
    return paymentMethod;
  }

  @Mutation('deletePaymentMethod')
  async deletePaymentMethod(
    @Args('id') id: string,
    @CurrentUser() user,
  ) {
    await this.paymentsService.deletePaymentMethod(id, user.id);
    return true;
  }
}
