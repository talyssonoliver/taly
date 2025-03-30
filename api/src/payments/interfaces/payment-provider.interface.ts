import type { User } from "../../users/entities/user.entity";
import type { Payment } from "../entities/payment.entity";
import type { CapturePaymentOptions, PaymentMethod } from "./payment.interface";

// Basic configuration for payment providers
export type PaymentProviderConfig = {
	apiKey: string;
	apiSecret?: string;
	webhookSecret?: string;
	apiVersion?: string;
	liveMode: boolean;
	region?: string;
	[key: string]: unknown;
};

export type PaymentProviderOptions = {
	idempotencyKey?: string;
	[key: string]: unknown;
};

export type CustomerData = {
	id?: string;
	email?: string;
	name?: string;
	phone?: string;
	metadata?: Record<string, string>;
	[key: string]: unknown;
};

export type PaymentMethodUpdateData = {
	billingDetails?: {
		name?: string;
		email?: string;
		phone?: string;
		address?: {
			line1?: string;
			line2?: string;
			city?: string;
			state?: string;
			postalCode?: string;
			country?: string;
		};
	};
	metadata?: Record<string, string>;
	[key: string]: unknown;
};

export type ProviderCreatePaymentResponse = {
	success: boolean;
	paymentId?: string;
	transactionId?: string;
	amount?: number;
	status?: string;
	error?: string;
	provider?: string;
};

export type RefundResponse = {
	success: boolean;
	refundId?: string;
	amount?: number;
	status?: string;
	error?: string;
};

export type CapturePaymentResponse = {
	id: string;
	status: string;
	amount: number;
	currency: string;
	capturedAt: Date;
	metadata?: Record<string, string>;
};

export type CancelPaymentResponse = {
	id: string;
	status: string;
	canceledAt: Date;
};

export type RefundPaymentResponse = {
	id: string;
	paymentId: string;
	amount: number;
	currency: string;
	status: string;
	reason?: string;
	refundedAt: Date;
};

export type PaymentDetails = {
	id: string;
	status: string;
	amount: number;
	currency: string;
	customerId?: string;
	paymentMethodId?: string;
	description?: string;
	metadata?: Record<string, string>;
	createdAt: Date;
	updatedAt: Date;
	capturedAt?: Date;
	canceledAt?: Date;
};

export type CustomerResponse = {
	id: string;
	email?: string;
	name?: string;
	phone?: string;
	createdAt: Date;
	updatedAt: Date;
	metadata?: Record<string, string>;
};

export type WebhookEvent = {
	id: string;
	type: string;
	data: unknown;
	createdAt: Date;
};

// Card details type for payment processing
export type CardDetails = {
	number: string;
	expiryMonth: string;
	expiryYear: string;
	cvc: string;
	name?: string;
};

export type StripeSetupIntentResponse = {
	id: string;
	clientSecret: string;
	status: string;
	customerId: string;
	createdAt: Date;
};

export type BillingAgreementResponse = {
	id: string;
	token?: string;
	status: string;
	customerId: string;
	redirectUrl?: string;
	createdAt: Date;
};

// Define the main interface with a descriptive name
export interface PaymentProviderInterface {
	initialize(config: PaymentProviderConfig): Promise<void>;

	createPayment(
		amount: number,
		userId: string,
		appointmentId: string,
	): Promise<Payment>;

	processPayment(
		paymentId: string,
		paymentMethodId: string,
		user: User,
	): Promise<Payment>;

	refundPayment(paymentId: string, amount: number): Promise<Payment>;

	getPaymentStatus(paymentId: string): Promise<string>;

	capturePayment(
		paymentId: string,
		options?: CapturePaymentOptions,
	): Promise<CapturePaymentResponse>;

	cancelPayment(
		paymentId: string,
		options?: PaymentProviderOptions,
	): Promise<CancelPaymentResponse>;

	retrievePayment(
		paymentId: string,
		options?: PaymentProviderOptions,
	): Promise<PaymentDetails>;

	createPaymentMethod(
		paymentMethodData: Record<string, unknown>,
		options?: PaymentProviderOptions,
	): Promise<PaymentMethod>;

	updatePaymentMethod(
		paymentMethodId: string,
		data: PaymentMethodUpdateData,
		options?: PaymentProviderOptions,
	): Promise<PaymentMethod>;

	deletePaymentMethod(
		paymentMethodId: string,
		options?: PaymentProviderOptions,
	): Promise<boolean>;

	createCustomer(
		customerData: CustomerData,
		options?: PaymentProviderOptions,
	): Promise<CustomerResponse>;

	updateCustomer(
		customerId: string,
		customerData: CustomerData,
		options?: PaymentProviderOptions,
	): Promise<CustomerResponse>;

	generateClientToken(
		customerId?: string,
		options?: PaymentProviderOptions,
	): Promise<string>;

	validateWebhook(payload: unknown, signature: string): Promise<boolean>;

	parseWebhookEvent(payload: unknown, signature: string): Promise<WebhookEvent>;

	refund(paymentId: string, amount: number): Promise<boolean>;
}

// Re-export the interface for backward compatibility
export type IPaymentProvider = PaymentProviderInterface;

// Provider-specific interfaces
// Fixed: Renamed to avoid ambiguity
export interface StripePaymentProvider extends PaymentProviderInterface {
	attachPaymentMethodToCustomer(
		customerId: string,
		paymentMethodId: string,
	): Promise<PaymentMethod>;

	createSetupIntent(
		customerId: string,
		options?: PaymentProviderOptions,
	): Promise<StripeSetupIntentResponse>;
}

export interface PayPalProvider extends PaymentProviderInterface {
	createBillingAgreement(
		customerId: string,
		options?: PaymentProviderOptions,
	): Promise<BillingAgreementResponse>;

	executeBillingAgreement(
		token: string,
		options?: PaymentProviderOptions,
	): Promise<BillingAgreementResponse>;
}
