import { IsNotEmpty, IsUUID, IsOptional, IsBoolean, IsDate, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'User ID',
    example: '5f8d0f3c-ebc6-4dec-a9fa-e7a8ed6d28b8',
  })
  @IsNotEmpty()
  @IsUUID()
  @Field()
  userId: string;

  @ApiProperty({
    description: 'Plan ID',
    example: '7a9d25a1-8dfa-456c-8c82-8ddc190b74b8',
  })
  @IsNotEmpty()
  @IsUUID()
  @Field()
  planId: string;

  @ApiProperty({
    description: 'Start date',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Field({ nullable: true })
  startDate?: Date;

  @ApiProperty({
    description: 'Auto-renewal setting',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  isAutoRenew?: boolean;

  @ApiProperty({
    description: 'Payment method ID',
    example: 'pm_1234567890',
    required: false,
  })
  @IsOptional()
  @Field({ nullable: true })
  paymentMethodId?: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { referralCode: 'FRIEND123' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Field({ nullable: true })
  metadata?: Record<string, any>;
}
