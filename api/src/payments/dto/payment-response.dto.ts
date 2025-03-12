import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL_REFUNDED = 'partial_refunded',
  CANCELED = 'canceled',
}

export class PaymentMethodDetails {
  @ApiProperty({ description: 'Payment method type (card, bank_transfer, etc.)' })
  type: string;

  @ApiPropertyOptional({ description: 'Last 4 digits of the card' })
  last4?: string;

  @ApiPropertyOptional({ description: 'Card brand (visa, mastercard, etc.)' })
  brand?: string;

  @ApiPropertyOptional({ description: 'Card expiration month' })
  expMonth?: number;

  @ApiPropertyOptional({ description: 'Card expiration year' })
  expYear?: number;

  @ApiPropertyOptional({ description: 'Bank account details' })
  bankAccount?: {
    bankName?: string;
    accountLast4?: string;
  };
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment ID' })
  id: string;

  @ApiProperty({ description: 'Payment amount in cents' })
  amount: number;

  @ApiProperty({ description: 'Currency code (e.g., USD, EUR)' })
  currency: string;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ description: 'Payment created timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Payment updated timestamp' })
  updatedAt?: Date;

  @ApiProperty({ description: 'User ID who made the payment' })
  userId: string;

  @ApiPropertyOptional({ description: 'Subscription ID associated with the payment' })
  subscriptionId?: string;

  @ApiPropertyOptional({ description: 'Invoice ID associated with the payment' })
  invoiceId?: string;

  @ApiProperty({ description: 'Payment description' })
  description: string;

  @ApiProperty({ description: 'Payment method details' })
  @Type(() => PaymentMethodDetails)
  paymentMethod: PaymentMethodDetails;

  @ApiPropertyOptional({ description: 'External payment provider ID (e.g., Stripe)' })
  externalId?: string;

  @ApiPropertyOptional({ description: 'Payment provider (e.g., stripe, paypal)' })
  provider?: string;

  @ApiPropertyOptional({ description: 'Error message if payment failed' })
  errorMessage?: string;

  @ApiPropertyOptional({ description: 'Refund details' })
  refunds?: {
    id: string;
    amount: number;
    status: string;
    reason?: string;
    createdAt: Date;
  }[];

  @ApiPropertyOptional({ description: 'Metadata for the payment' })
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Receipt URL' })
  receiptUrl?: string;

  @ApiProperty({ description: 'Whether the payment is live or test mode' })
  liveMode: boolean;

  @Expose()
  get refundedAmount(): number {
    if (!this.refunds || this.refunds.length === 0) {
      return 0;
    }
    
    return this.refunds
      .filter(refund => refund.status === 'succeeded')
      .reduce((sum, refund) => sum + refund.amount, 0);
  }
}
