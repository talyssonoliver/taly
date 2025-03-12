import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Subscription } from '../entities/subscription.entity';
import { Plan } from '../entities/plan.entity';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { SubscriptionStatus, BillingPeriod } from '../constants/subscription.constants';

@Injectable()
export class SubscriptionRepository {
  constructor(
    
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find();
  }

  async findById(id: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({ where: { userId } });
  }

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    plan: Plan,
  ): Promise<Subscription> {
    const subscription = new Subscription();
    subscription.userId = createSubscriptionDto.userId;
    subscription.plan = plan;
    subscription.price = plan.price;
    subscription.currency = plan.currency;
    subscription.billingPeriod = plan.billingPeriod;
    subscription.startDate = createSubscriptionDto.startDate || new Date();
    subscription.isAutoRenew = createSubscriptionDto.isAutoRenew !== undefined 
      ? createSubscriptionDto.isAutoRenew 
      : true;
    
    // Calculate renewal date based on billing period
    const renewalDate = new Date(subscription.startDate);
    switch (plan.billingPeriod) {
      case BillingPeriod.MONTHLY:
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        break;
      case BillingPeriod.QUARTERLY:
        renewalDate.setMonth(renewalDate.getMonth() + 3);
        break;
      case BillingPeriod.BIANNUAL:
        renewalDate.setMonth(renewalDate.getMonth() + 6);
        break;
      case BillingPeriod.ANNUAL:
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        break;
    }
    
    subscription.renewalDate = renewalDate;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.paymentMethodId = createSubscriptionDto.paymentMethodId;
    subscription.metadata = createSubscriptionDto.metadata;

    return this.subscriptionRepository.save(subscription);
  }

  async updateSubscription(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    await this.subscriptionRepository.update(id, {
      isAutoRenew: updateSubscriptionDto.isAutoRenew,
      paymentMethodId: updateSubscriptionDto.paymentMethodId,
      metadata: updateSubscriptionDto.metadata,
    });

    return this.findById(id);
  }

  async updateStatus(id: string, status: SubscriptionStatus): Promise<void> {
    const updateData: any = { status };
    
    if (status === SubscriptionStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
    }
    
    await this.subscriptionRepository.update(id, updateData);
  }

  async changePlan(
    id: string,
    newPlan: Plan,
    immediateChange: boolean = false,
  ): Promise<Subscription> {
    const subscription = await this.findById(id);

    // If immediate change, update subscription right away
    if (immediateChange) {
      subscription.plan = newPlan;
      subscription.price = newPlan.price;
      subscription.currency = newPlan.currency;
      subscription.billingPeriod = newPlan.billingPeriod;
      
      // Recalculate renewal date
      const renewalDate = new Date();
      switch (newPlan.billingPeriod) {
        case BillingPeriod.MONTHLY:
          renewalDate.setMonth(renewalDate.getMonth() + 1);
          break;
        case BillingPeriod.QUARTERLY:
          renewalDate.setMonth(renewalDate.getMonth() + 3);
          break;
        case BillingPeriod.BIANNUAL:
          renewalDate.setMonth(renewalDate.getMonth() + 6);
          break;
        case BillingPeriod.ANNUAL:
          renewalDate.setFullYear(renewalDate.getFullYear() + 1);
          break;
      }
      
      subscription.renewalDate = renewalDate;
    } else {
      // Store the new plan info in metadata to apply on next renewal
      if (!subscription.metadata) {
        subscription.metadata = {};
      }
      
      subscription.metadata.pendingPlanChange = {
        planId: newPlan.id,
        applyAt: subscription.renewalDate,
      };
    }
    
    return this.subscriptionRepository.save(subscription);
  }
}



