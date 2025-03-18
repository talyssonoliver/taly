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
	Min,
	IsObject,
} from "class-validator";
import { Type } from "class-transformer";

export class CardDetailsDto {
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

export class BankAccountDetailsDto {
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

	@ApiProperty({ description: "Bank name" })
	@IsNotEmpty()
	@IsString()
	bankName: string;

	@ApiPropertyOptional({ description: "Account type (checking, savings)" })
	@IsOptional()
	@IsString()
	@IsIn(["checking", "savings"])
	accountType?: string;
}

export class PaymentTokenDto {
	@ApiProperty({ description: "Payment token ID from payment processor" })
	@IsNotEmpty()
	@IsString()
	id: string;

	@ApiPropertyOptional({ description: "Payment processor (stripe, paypal)" })
	@IsOptional()
	@IsString()
	@IsIn(["stripe", "paypal", "braintree"])
	processor?: string;
}

export class ProcessPaymentDto {
	@ApiProperty({ description: "Amount to charge in cents" })
	@IsNotEmpty()
	@IsNumber()
	@Min(50) // Usually minimum amount is $0.50
	amount: number;

	@ApiProperty({ description: "Currency code (GBP, EUR, etc.)" })
	@IsNotEmpty()
	@IsString()
	@IsIn(["USD", "EUR", "GBP", "CAD", "AUD", "JPY"])
	currency: string;

	@ApiProperty({ description: "Payment method type" })
	@IsNotEmpty()
	@IsString()
	@IsIn(["card", "bank_account", "payment_token"])
	paymentMethodType: string;

	@ApiPropertyOptional({
		description: "Card details (required if paymentMethodType is card)",
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CardDetailsDto)
	cardDetails?: CardDetailsDto;

	@ApiPropertyOptional({
		description:
			"Bank account details (required if paymentMethodType is bank_account)",
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => BankAccountDetailsDto)
	bankAccountDetails?: BankAccountDetailsDto;

	@ApiPropertyOptional({
		description:
			"Payment token (required if paymentMethodType is payment_token)",
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => PaymentTokenDto)
	paymentToken?: PaymentTokenDto;

	@ApiPropertyOptional({
		description: "Payment method ID if using a saved payment method",
	})
	@IsOptional()
	@IsString()
	paymentMethodId?: string;

	@ApiPropertyOptional({ description: "Customer ID" })
	@IsOptional()
	@IsUUID()
	customerId?: string;

	@ApiPropertyOptional({ description: "Description of the payment" })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({
		description: "Whether to save payment method for future use",
	})
	@IsOptional()
	@IsBoolean()
	savePaymentMethod?: boolean;

	@ApiPropertyOptional({
		description: "Subscription ID if payment is for a subscription",
	})
	@IsOptional()
	@IsString()
	subscriptionId?: string;

	@ApiPropertyOptional({
		description: "Invoice ID if payment is for an invoice",
	})
	@IsOptional()
	@IsString()
	invoiceId?: string;

	@ApiPropertyOptional({ description: "Additional metadata for the payment" })
	@IsOptional()
	@IsObject()
	metadata?: Record<string, any>;

	@ApiPropertyOptional({
		description: "Return URL for redirect after successful payment",
	})
	@IsOptional()
	@IsString()
	successUrl?: string;

	@ApiPropertyOptional({
		description: "Return URL for redirect after failed payment",
	})
	@IsOptional()
	@IsString()
	cancelUrl?: string;
}
