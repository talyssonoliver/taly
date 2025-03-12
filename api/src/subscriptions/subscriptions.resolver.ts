import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import { Plan } from './entities/plan.entity';
import { Feature } from './entities/feature.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => Subscription)
@UseGuards(GqlAuthGuard)
export class SubscriptionsResolver {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Mutation(() => Subscription)
  async createSubscription(
    @Args('createSubscriptionInput') createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createSubscription(createSubscriptionDto);
  }

  @Query(() => [Subscription], { name: 'subscriptions' })
  async findAllSubscriptions() {
    return this.subscriptionsService.findAllSubscriptions();
  }

  @Query(() => Subscription, { name: 'subscription' })
  async findSubscriptionById(@Args('id', { type: () => String }) id: string) {
    return this.subscriptionsService.findSubscriptionById(id);
  }

  @Mutation(() => Subscription)
  async updateSubscription(
    @Args('id', { type: () => String }) id: string,
    @Args('updateSubscriptionInput') updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.updateSubscription(id, updateSubscriptionDto);
  }

  @Mutation(() => Boolean)
  async cancelSubscription(@Args('id', { type: () => String }) id: string) {
    await this.subscriptionsService.cancelSubscription(id);
    return true;
  }

  @Mutation(() => Subscription)
  async changePlan(
    @Args('id', { type: () => String }) id: string,
    @Args('changePlanInput') changePlanDto: ChangePlanDto,
  ) {
    return this.subscriptionsService.changePlan(id, changePlanDto);
  }

  @Query(() => [Plan], { name: 'plans' })
  async getAllPlans() {
    return this.subscriptionsService.getAllPlans();
  }

  @Query(() => [Subscription], { name: 'userSubscriptions' })
  async getSubscriptionsByUserId(@Args('userId', { type: () => String }) userId: string) {
    return this.subscriptionsService.getSubscriptionsByUserId(userId);
  }
}
