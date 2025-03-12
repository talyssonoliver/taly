import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/roles.enum';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { PaginationUtil } from '../common/utils/pagination.util';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus })
  @Roles(Role.ADMIN)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: PaymentStatus,
  ) {
    this.logger.log("Finding all payments with page=" + page + ", limit=" + limit + (status ? ", status=" + status : ""));
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.paymentsService.findAll(pageNum, limitNum, { status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async findOne(@Param('id') id: string) {
    this.logger.log(Finding payment with ID: );
    const payment = await this.paymentsService.findById(id);
    
    if (!payment) {
      throw new NotFoundException(Payment with ID  not found);
    }
    
    return payment;
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get payments by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Roles(Role.ADMIN, Role.STAFF)
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    this.logger.log(Finding payments for user ID: );
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.paymentsService.findByUserId(userId, pageNum, limitNum);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user payments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMyPayments(
    @CurrentUser() user,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    this.logger.log(Finding payments for current user ID: );
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.paymentsService.findByUserId(user.id, pageNum, limitNum);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Creating payment for appointment: );
    return this.paymentsService.create(createPaymentDto, user.id);
  }

  @Post('process')
  @ApiOperation({ summary: 'Process a payment' })
  @HttpCode(HttpStatus.OK)
  async process(
    @Body() processPaymentDto: ProcessPaymentDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Processing payment: );
    
    const payment = await this.paymentsService.findById(processPaymentDto.paymentId);
    
    if (!payment) {
      throw new NotFoundException(Payment with ID  not found);
    }
    
    // Check if user is authorized to process this payment
    if (payment.userId !== user.id && user.role !== Role.ADMIN && user.role !== Role.STAFF) {
      throw new ForbiddenException('You are not authorized to process this payment');
    }
    
    return this.paymentsService.process(processPaymentDto, user.id);
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund a payment' })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.STAFF)
  async refund(
    @Body() refundPaymentDto: RefundPaymentDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Refunding payment: );
    
    const payment = await this.paymentsService.findById(refundPaymentDto.paymentId);
    
    if (!payment) {
      throw new NotFoundException(Payment with ID  not found);
    }
    
    return this.paymentsService.refund(refundPaymentDto, user.id);
  }

  @Post('methods')
  @ApiOperation({ summary: 'Add a payment method' })
  @HttpCode(HttpStatus.CREATED)
  async addPaymentMethod(
    @Body() paymentMethodDto: PaymentMethodDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Adding payment method for user: );
    return this.paymentsService.addPaymentMethod(paymentMethodDto, user.id);
  }

  @Get('methods')
  @ApiOperation({ summary: 'Get user payment methods' })
  async getPaymentMethods(@CurrentUser() user) {
    this.logger.log(Getting payment methods for user: );
    return this.paymentsService.getPaymentMethods(user.id);
  }

  @Get('methods/:id')
  @ApiOperation({ summary: 'Get payment method by ID' })
  @ApiParam({ name: 'id', description: 'Payment Method ID' })
  async getPaymentMethod(
    @Param('id') id: string,
    @CurrentUser() user,
  ) {
    this.logger.log(Getting payment method with ID: );
    const paymentMethod = await this.paymentsService.getPaymentMethodById(id);
    
    if (!paymentMethod) {
      throw new NotFoundException(Payment method with ID  not found);
    }
    
    // Check if user is authorized to access this payment method
    if (paymentMethod.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to access this payment method');
    }
    
    return paymentMethod;
  }

  @Public()
  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(@Body() event: any) {
    this.logger.log(Received Stripe webhook event: );
    return this.paymentsService.handleStripeWebhook(event);
  }

  @Public()
  @Post('webhooks/paypal')
  @ApiOperation({ summary: 'Handle PayPal webhook events' })
  @HttpCode(HttpStatus.OK)
  async paypalWebhook(@Body() event: any) {
    this.logger.log(Received PayPal webhook event: );
    return this.paymentsService.handlePaypalWebhook(event);
  }
}
