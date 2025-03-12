import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsIn,
  Min,
  Max,
  IsObject,
} from 'class-validator';

export class RefundPaymentDto {
  @ApiProperty({ description: 'Payment ID to refund' })
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @ApiPropertyOptional({ description: 'Amount to refund in cents (defaults to full amount if not specified)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiPropertyOptional({ description: 'Reason for the refund' })
  @IsOptional()
  @IsString()
  @IsIn(['requested_by_customer', 'duplicate', 'fraudulent', 'other'])
  reason?: string;

  @ApiPropertyOptional({ description: 'Detailed refund reason' })
  @IsOptional()
  @IsString()
  @Max(500)
  reasonDetails?: string;

  @ApiPropertyOptional({ description: 'Whether to refund application fees' })
  @IsOptional()
  @IsBoolean()
  refundApplicationFee?: boolean;

  @ApiPropertyOptional({ description: 'Additional metadata for the refund' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
