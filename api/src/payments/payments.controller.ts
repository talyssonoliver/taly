import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { Role } from '../common/enums/roles.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PaginationUtil } from '../common/utils/pagination.util';
import { UserWithoutPassword } from '../users/interfaces/user.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentMethodResponseDto } from './dto/payment-method.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundResponseDto } from './dto/refund-response.dto';
import { RefundDto } from './dto/refund.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  // Main payment endpoints
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
    this.logger.log(`Finding all payments with page=${page}, limit=${limit}${status ? `, status=${status}` : ""}`);
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.paymentsService.findAll(pageNum, limitNum, { status });
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
    this.logger.log(`Finding payments for current user ID: ${user.id}`);
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.paymentsService.findByUserId(user.id, pageNum, limitNum);
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
    this.logger.log(`Finding payments for user ID: ${userId}`);
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.paymentsService.findByUserId(userId, pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment details' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  async findOne(@Param('id') id: string): Promise<PaymentResponseDto> {
    try {
      this.logger.log(`Getting payment details for ID: ${id}`);
      const payment = await this.paymentsService.findById(id);
      
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      
      return payment;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error fetching payment';
      this.logger.error(`Error getting payment: ${message}`);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to retrieve payment details');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiBody({ type: CreatePaymentDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: Request,
  ): Promise<PaymentResponseDto> {
    try {
      const user = req.user as UserWithoutPassword;
      
      if (!user?.id) {
        throw new BadRequestException('User not authenticated');
      }
      
      this.logger.log(`Creating payment for user ID: ${user.id}`);
      return await this.paymentsService.create(createPaymentDto, user.id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error creating payment';
      this.logger.error(`Error creating payment: ${message}`);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to create payment');
    }
  }

  @Post('process')
  @ApiOperation({ summary: 'Process a payment' })
  @HttpCode(HttpStatus.OK)
  async process(
    @Body() processPaymentDto: ProcessPaymentDto,
    @CurrentUser() user,
  ) {
    this.logger.log(`Processing payment: ${processPaymentDto.paymentId}`);
    
    const payment = await this.paymentsService.findById(processPaymentDto.paymentId);
    
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${processPaymentDto.paymentId} not found`);
    }
    
    // Check if user is authorized to process this payment
    if (payment.userId !== user.id && user.role !== Role.ADMIN && user.role !== Role.STAFF) {
      throw new ForbiddenException('You are not authorized to process this payment');
    }
    
    return this.paymentsService.process(processPaymentDto, user.id);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Refund a payment' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiBody({ type: RefundDto })
  @Roles(Role.ADMIN)
  async refund(
    @Param('id') id: string,
    @Body() refundDto: RefundDto,
  ): Promise<RefundResponseDto> {
    try {
      this.logger.log(`Processing refund for payment ID: ${id}`);
      return await this.paymentsService.refund(id, refundDto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error processing refund';
      this.logger.error(`Error processing refund: ${message}`);
      
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to process refund');
    }
  }

  @Post(':id/capture')
  @ApiOperation({ summary: 'Capture an authorized payment' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @Roles(Role.ADMIN)
  async capture(@Param('id') id: string): Promise<PaymentResponseDto> {
    try {
      this.logger.log(`Capturing payment ID: ${id}`);
      return await this.paymentsService.capture(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error capturing payment';
      this.logger.error(`Error capturing payment: ${message}`);
      
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to capture payment');
    }
  }

  // Payment methods endpoints
  @Post('methods')
  @ApiOperation({ summary: 'Add a payment method' })
  @HttpCode(HttpStatus.CREATED)
  async addPaymentMethod(
    @Body() paymentMethodDto: PaymentMethodResponseDto,
    @CurrentUser() user,
  ) {
    this.logger.log(`Adding payment method for user: ${user.id}`);
    return this.paymentsService.addPaymentMethod(paymentMethodDto, user.id);
  }

  @Get('methods')
  @ApiOperation({ summary: 'Get user payment methods' })
  async getPaymentMethods(@CurrentUser() user) {
    this.logger.log(`Getting payment methods for user: ${user.id}`);
    return this.paymentsService.getPaymentMethods(user.id);
  }

  @Get('methods/:id')
  @ApiOperation({ summary: 'Get payment method by ID' })
  @ApiParam({ name: 'id', description: 'Payment Method ID' })
  async getPaymentMethod(
    @Param('id') id: string,
    @CurrentUser() user,
  ) {
    this.logger.log(`Getting payment method with ID: ${id}`);
    const paymentMethod = await this.paymentsService.getPaymentMethodById(id);
    
    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }
    
    // Check if user is authorized to access this payment method
    if (paymentMethod.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to access this payment method');
    }
    
    return paymentMethod;
  }

  // Webhook endpoints
  @Public()
  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(@Body() event: any) {
    this.logger.log(`Received Stripe webhook event: ${event.type}`);
    return this.paymentsService.handleStripeWebhook(event);
  }

  @Public()
  @Post('webhooks/paypal')
  @ApiOperation({ summary: 'Handle PayPal webhook events' })
  @HttpCode(HttpStatus.OK)
  async paypalWebhook(@Body() event: any) {
    this.logger.log(`Received PayPal webhook event: ${event.type}`);
    return this.paymentsService.handlePaypalWebhook(event);
  }
}