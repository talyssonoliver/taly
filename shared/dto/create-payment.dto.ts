import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsUUID,
	IsNumber,
	IsEnum,
	Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { PaymentProvider, PaymentStatus } from "../types/payment.interface";

export class CreatePaymentDto {
	@ApiProperty({
		description: "Appointment ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Appointment ID is required" })
	appointmentId: string;

	@ApiProperty({
		description: "Payment amount",
		example: 35.0,
		minimum: 0,
	})
	@IsNumber()
	@Min(0, { message: "Amount cannot be negative" })
	@Type(() => Number)
	@IsNotEmpty({ message: "Amount is required" })
	amount: number;

	@ApiPropertyOptional({
		description: "Payment status",
		enum: PaymentStatus,
		default: PaymentStatus.PENDING,
	})
	@IsEnum(PaymentStatus)
	@IsOptional()
	status?: PaymentStatus;

	@ApiPropertyOptional({
		description: "Payment method",
		example: "credit_card",
	})
	@IsString()
	@IsOptional()
	paymentMethod?: string;

	@ApiPropertyOptional({
		description: "Transaction ID from payment provider",
		example: "txn_1Hq6B92eZvKYlo2CzzxkQtxM",
	})
	@IsString()
	@IsOptional()
	transactionId?: string;

	@ApiProperty({
		description: "Payment provider",
		enum: PaymentProvider,
		example: PaymentProvider.STRIPE,
	})
	@IsEnum(PaymentProvider)
	@IsNotEmpty({ message: "Payment provider is required" })
	provider: PaymentProvider;

	@ApiPropertyOptional({
		description: "Provider-specific ID",
		example: "cus_Hq6B92eZvKYlo2C",
	})
	@IsString()
	@IsOptional()
	providerId?: string;

	@ApiProperty({
		description: "Currency code",
		example: "USD",
	})
	@IsString()
	@IsNotEmpty({ message: "Currency is required" })
	currency: string;

	@ApiPropertyOptional({
		description: "Additional payment metadata",
		example: {
			receipt_email: "customer@example.com",
			shipping: {
				address: {
					city: "San Francisco",
					country: "US",
					line1: "123 Market St",
					postal_code: "94107",
					state: "CA",
				},
				name: "Jenny Rosen",
			},
		},
	})
	@IsOptional()
	metadata?: Record<string, any>;
}