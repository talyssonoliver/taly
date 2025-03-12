import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';
import { SubscriptionStatus, BillingPeriod } from '../constants/subscription.constants';

@ObjectType()
class FeatureDto {
  @ApiProperty({
    description: 'Feature ID',
    example: '5d91d064-b4c8-48a0-8d13-b987c7aa58de',
  })
  @Field()
  id: string;

  @ApiProperty({
    description: 'Feature name',
    example: 'Storage',
  })
  @Field()
  name: string;

  @ApiProperty({
    description: 'Feature value',
    example: { amount: 10, unit: 'GB' },
  })
  @Field()
  value: any;
}

@ObjectType()
export class SubscriptionResponseDto {
  @ApiProperty({
    description: 'Subscription ID',
    example: '5f8d0f3c-ebc6-4dec-a9fa-e7a8ed6d28b8',
  })
  @Field()
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '5f8d0f3c-ebc6-4dec-a9fa-e7a8ed6d28b8',
  })
  @Field()
  userId: string;

  @ApiProperty({
    description: 'Plan ID',
    example: '7a9d25a1-8dfa-456c-8c82-8ddc190b74b8',
  })
  @Field()
  planId: string;

  @ApiProperty({
    description: 'Plan name',
    example: 'Premium',
  })
  @Field()
  planName: string;

  @ApiProperty({
    description: 'Subscription status',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @Field()
  status: SubscriptionStatus;

  @ApiProperty({
    description: 'Subscription start date',
    example: '2023-01-01T00:00:00Z',
  })
  @Field()
  startDate: Date;

  @ApiProperty({
    description: 'Subscription end date',
    example: '2023-12-31T23:59:59Z',
    nullable: true,
  })
  @Field({ nullable: true })
  endDate: Date | null;

  @ApiProperty({
    description: 'Next renewal date',
    example: '2023-02-01T00:00:00Z',
    nullable: true,
  })
  @Field({ nullable: true })
  renewalDate: Date | null;

  @ApiProperty({
    description: 'Cancellation date',
    example: '2023-06-15T10:30:00Z',
    nullable: true,
  })
  @Field({ nullable: true })
  cancelledAt: Date | null;

  @ApiProperty({
    description: 'Auto-renewal setting',
    example: true,
  })
  @Field()
  isAutoRenew: boolean;

  @ApiProperty({
    description: 'Features included in the plan',
    type: [FeatureDto],
  })
  @Field(() => [FeatureDto])
  features: FeatureDto[];

  @ApiProperty({
    description: 'Subscription price',
    example: 19.99,
  })
  @Field()
  price: number;

  @ApiProperty({
    description: 'Currency',
    example: 'USD',
  })
  @Field()
  currency: string;

  @ApiProperty({
    description: 'Billing period',
    enum: BillingPeriod,
    example: BillingPeriod.MONTHLY,
  })
  @Field()
  billingPeriod: BillingPeriod;

  @ApiProperty({
    description: 'Subscription creation date',
    example: '2023-01-01T00:00:00Z',
  })
  @Field()
  createdAt: Date;

  @ApiProperty({
    description: 'Subscription last update date',
    example: '2023-01-15T10:30:00Z',
  })
  @Field()
  updatedAt: Date;
}
