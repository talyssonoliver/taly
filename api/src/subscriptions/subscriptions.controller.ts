import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('subscriptions')
@Controller('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SubscriptionResponseDto })
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionsService.createSubscription(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiResponse({ status: HttpStatus.OK, type: [SubscriptionResponseDto] })
  async findAllSubscriptions(): Promise<SubscriptionResponseDto[]> {
    return this.subscriptionsService.findAllSubscriptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by id' })
  @ApiResponse({ status: HttpStatus.OK, type: SubscriptionResponseDto })
  async findSubscriptionById(
    @Param('id') id: string,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionsService.findSubscriptionById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update subscription' })
  @ApiResponse({ status: HttpStatus.OK, type: SubscriptionResponseDto })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionsService.updateSubscription(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelSubscription(@Param('id') id: string): Promise<void> {
    return this.subscriptionsService.cancelSubscription(id);
  }

  @Post(':id/change-plan')
  @ApiOperation({ summary: 'Change subscription plan' })
  @ApiResponse({ status: HttpStatus.OK, type: SubscriptionResponseDto })
  async changePlan(
    @Param('id') id: string,
    @Body() changePlanDto: ChangePlanDto,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionsService.changePlan(id, changePlanDto);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get all available plans' })
  @ApiResponse({ status: HttpStatus.OK, type: [PlanResponseDto] })
  async getAllPlans(): Promise<PlanResponseDto[]> {
    return this.subscriptionsService.getAllPlans();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get subscriptions by user id' })
  @ApiResponse({ status: HttpStatus.OK, type: [SubscriptionResponseDto] })
  async getSubscriptionsByUserId(
    @Param('userId') userId: string,
  ): Promise<SubscriptionResponseDto[]> {
    return this.subscriptionsService.getSubscriptionsByUserId(userId);
  }
}
