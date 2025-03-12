import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { PlanRepository } from './repositories/plan.repository';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import { SubscriptionStatus } from './constants/subscription.constants';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const plan = await this.planRepository.findOne(createSubscriptionDto.planId);
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Create subscription logic
    const subscription = await this.subscriptionRepository.createSubscription(createSubscriptionDto, plan);
    
    return this.mapToSubscriptionResponse(subscription);
  }

  async findAllSubscriptions(): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepository.findAll();
    return subscriptions.map(sub => this.mapToSubscriptionResponse(sub));
  }

  async findSubscriptionById(id: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    
    return this.mapToSubscriptionResponse(subscription);
  }

  async updateSubscription(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Update subscription logic
    const updatedSubscription = await this.subscriptionRepository.updateSubscription(id, updateSubscriptionDto);
    
    return this.mapToSubscriptionResponse(updatedSubscription);
  }

  async cancelSubscription(id: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Cancel subscription logic
    await this.subscriptionRepository.updateStatus(id, SubscriptionStatus.CANCELLED);
  }

  async changePlan(
    id: string,
    changePlanDto: ChangePlanDto,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const newPlan = await this.planRepository.findOne(changePlanDto.newPlanId);
    if (!newPlan) {
      throw new NotFoundException('New plan not found');
    }

    // Change plan logic
    const updatedSubscription = await this.subscriptionRepository.changePlan(id, newPlan, changePlanDto.immediateChange);
    
    return this.mapToSubscriptionResponse(updatedSubscription);
  }

  async getAllPlans(): Promise<PlanResponseDto[]> {
    const plans = await this.planRepository.findAll();
    return plans.map(plan => this.mapToPlanResponse(plan));
  }

  async getSubscriptionsByUserId(userId: string): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepository.findByUserId(userId);
    return subscriptions.map(sub => this.mapToSubscriptionResponse(sub));
  }

  private mapToSubscriptionResponse(subscription: any): SubscriptionResponseDto {
    // Map subscription entity to response DTO
    const response = new SubscriptionResponseDto();
    response.id = subscription.id;
    response.userId = subscription.userId;
    response.planId = subscription.plan.id;
    response.planName = subscription.plan.name;
    response.status = subscription.status;
    response.startDate = subscription.startDate;
    response.endDate = subscription.endDate;
    response.renewalDate = subscription.renewalDate;
    response.cancelledAt = subscription.cancelledAt;
    response.isAutoRenew = subscription.isAutoRenew;
    response.features = subscription.plan.features.map(feature => ({
      id: feature.id,
      name: feature.name,
      value: feature.value,
    }));
    response.price = subscription.price;
    response.currency = subscription.currency;
    response.billingPeriod = subscription.billingPeriod;
    response.createdAt = subscription.createdAt;
    response.updatedAt = subscription.updatedAt;
    
    return response;
  }

  private mapToPlanResponse(plan: any): PlanResponseDto {
    // Map plan entity to response DTO
    const response = new PlanResponseDto();
    response.id = plan.id;
    response.name = plan.name;
    response.description = plan.description;
    response.price = plan.price;
    response.currency = plan.currency;
    response.billingPeriod = plan.billingPeriod;
    response.isActive = plan.isActive;
    response.features = plan.features.map(feature => ({
      id: feature.id,
      name: feature.name,
      value: feature.value,
    }));
    
    return response;
  }
}
