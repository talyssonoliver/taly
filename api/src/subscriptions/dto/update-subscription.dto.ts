import { IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'Auto-renewal setting',
    example: true,
    required: false,
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
    example: { notes: 'Special arrangement' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Field({ nullable: true })
  metadata?: Record<string, any>;
}
