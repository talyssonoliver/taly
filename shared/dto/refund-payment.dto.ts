import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsUUID,
	IsNumber,
	Min,
	Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class RefundPaymentDto {
	@ApiProperty({
		description: "Payment ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Payment ID is required" })
	paymentId: string;

	@ApiProperty({
		description: "Refund amount",
		example: 35.0,
		minimum: 0,
	})
	@IsNumber()
	@Min(0, { message: "Amount cannot be negative" })
	@Type(() => Number)
	@IsNotEmpty({ message: "Amount is required" })
	amount: number;

	@ApiPropertyOptional({
		description: "Refund percentage (alternative to fixed amount)",
		example: 50,
		minimum: 0,
		maximum: 100,
	})
	@IsNumber()
	@Min(0, { message: "Percentage cannot be negative" })
	@Max(100, { message: "Percentage cannot exceed 100%" })
	@Type(() => Number)
	@IsOptional()
	percentage?: number;

	@ApiPropertyOptional({
		description: "Refund reason",
		example: "Customer request",
	})
	@IsString()
	@IsOptional()
	reason?: string;

	@ApiPropertyOptional({
		description: "Whether to refund to the original payment method",
		example: true,
		default: true,
	})
	@IsOptional()
	refundToOriginalMethod?: boolean;

	@ApiPropertyOptional({
		description: "Additional refund metadata",
		example: {
			initiated_by: "staff_id_123",
			authorized_by: "manager_id_456",
			notes: "Customer was dissatisfied with service",
		},
	})
	@IsOptional()
	metadata?: Record<string, any>;
}