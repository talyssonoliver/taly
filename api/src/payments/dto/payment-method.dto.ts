import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsNotEmpty,
	IsString,
	IsNumber,
	IsOptional,
	IsBoolean,
	IsUUID,
	IsIn,
	ValidateNested,
	IsObject,
	IsEmail,
} from "class-validator";
import { Type } from "class-transformer";

export class BillingDetailsDto {
	@ApiPropertyOptional({ description: "Customer name" })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({ description: "Customer email" })
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiPropertyOptional({ description: "Customer phone" })
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiPropertyOptional({ description: "Billing address" })
	@IsOptional()
	@IsObject()
	address?: {
		line1?: string;
		line2?: string;
		city?: string;
		state?: string;
		postalCode?: string;
		country?: string;
	};
}

export class CreateCardPaymentMethodDto {
	@ApiProperty({ description: "Card number" })
	@IsNotEmpty()
	@IsString()
	number: string;

	@ApiProperty({ description: "Expiration month (1-12)" })
	@IsNotEmpty()
	@IsNumber()
	expMonth: number;

	@ApiProperty({ description: "Expiration year (YYYY)" })
	@IsNotEmpty()
	@IsNumber()
	expYear: number;

	@ApiProperty({ description: "CVC/CVV security code" })
	@IsNotEmpty()
	@IsString()
	cvc: string;

	@ApiPropertyOptional({ description: "Cardholder name" })
	@IsOptional()
	@IsString()
	name?: string;
}

export class CreateBankAccountPaymentMethodDto {
	@ApiProperty({ description: "Account holder name" })
	@IsNotEmpty()
	@IsString()
	accountHolderName: string;

	@ApiProperty({ description: "Account number" })
	@IsNotEmpty()
	@IsString()
	accountNumber: string;

	@ApiProperty({ description: "Routing number" })
	@IsNotEmpty()
	@IsString()
	routingNumber: string;

	@ApiPropertyOptional({ description: "Account type (checking, savings)" })
	@IsOptional()
	@IsString()
	@IsIn(["checking", "savings"])
	accountType?: "checking" | "savings";
}

export class CreatePaymentMethodDto {
	@ApiProperty({ description: "User ID" })
	@IsNotEmpty()
	@IsUUID()
	userId: string;

	@ApiProperty({ description: "Payment method type" })
	@IsNotEmpty()
	@IsString()
	@IsIn(["card", "bank_account"])
	type: "card" | "bank_account";

	@ApiPropertyOptional({
		description: "Card details (required if type is card)",
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateCardPaymentMethodDto)
	card?: CreateCardPaymentMethodDto;

	@ApiPropertyOptional({
		description: "Bank account details (required if type is bank_account)",
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateBankAccountPaymentMethodDto)
	bankAccount?: CreateBankAccountPaymentMethodDto;

	@ApiPropertyOptional({ description: "Billing details" })
	@IsOptional()
	@ValidateNested()
	@Type(() => BillingDetailsDto)
	billingDetails?: BillingDetailsDto;

	@ApiPropertyOptional({
		description: "Whether this is the default payment method",
	})
	@IsOptional()
	@IsBoolean()
	isDefault?: boolean;

	@ApiPropertyOptional({ description: "Additional metadata" })
	@IsOptional()
	@IsObject()
	metadata?: Record<string, any>;
}

export class PaymentMethodResponseDto {
	@ApiProperty({ description: "Payment method ID" })
	id: string;

	@ApiProperty({ description: "User ID" })
	userId: string;

	@ApiProperty({ description: "Payment method type" })
	type: "card" | "bank_account";

	@ApiProperty({ description: "Card details" })
	card?: {
		brand: string;
		last4: string;
		expMonth: number;
		expYear: number;
		fingerprint?: string;
	};

	@ApiProperty({ description: "Bank account details" })
	bankAccount?: {
		bankName?: string;
		accountType?: string;
		last4: string;
		routingLast4?: string;
	};

	@ApiProperty({ description: "Billing details" })
	billingDetails?: BillingDetailsDto;

	@ApiProperty({ description: "Whether this is the default payment method" })
	isDefault: boolean;

	@ApiProperty({ description: "Creation date" })
	createdAt: Date;

	@ApiProperty({ description: "Last update date" })
	updatedAt: Date;

	@ApiPropertyOptional({
		description: "External payment method ID in payment processor",
	})
	externalId?: string;

	@ApiPropertyOptional({ description: "Payment processor (stripe, paypal)" })
	processor?: string;

	@ApiPropertyOptional({ description: "Additional metadata" })
	metadata?: Record<string, any>;
}

export class UpdatePaymentMethodDto {
	@ApiPropertyOptional({ description: "Card expiration month" })
	@IsOptional()
	@IsNumber()
	expMonth?: number;

	@ApiPropertyOptional({ description: "Card expiration year" })
	@IsOptional()
	@IsNumber()
	expYear?: number;

	@ApiPropertyOptional({ description: "Billing details" })
	@IsOptional()
	@ValidateNested()
	@Type(() => BillingDetailsDto)
	billingDetails?: BillingDetailsDto;

	@ApiPropertyOptional({
		description: "Whether this is the default payment method",
	})
	@IsOptional()
	@IsBoolean()
	isDefault?: boolean;

	@ApiPropertyOptional({ description: "Additional metadata" })
	@IsOptional()
	@IsObject()
	metadata?: Record<string, any>;
}
