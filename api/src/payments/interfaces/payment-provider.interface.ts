import type {
	ICreatePaymentResponse,
	ICapturePaymentOptions,
	IRefundPaymentOptions,
} from "./payment.interface";
import type {
	ProcessPaymentDto,
	CreatePaymentMethodDto,
	PaymentMethodResponseDto,
} from "../dto";

export interface IPaymentProviderConfig {
	apiKey: string;
	apiSecret?: string;
	webhookSecret?: string;
	apiVersion?: string;
	liveMode: boolean;
	region?: string;
	[key: string]: unknown;
}

export interface IPaymentProviderOptions {
	idempotencyKey?: string;
	[key: string]: unknown;
}

export interface ICustomerData {
	id?: string;
	email?: string;
	name?: string;
	phone?: string;
	metadata?: Record<string, string>;
	[key: string]: unknown;
}

export interface IPaymentMethodUpdateData {
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
}

export interface ICapturePaymentResponse {
	id: string;
	status: string;
	amount: number;
	currency: string;
	capturedAt: Date;
	metadata?: Record<string, string>;
}

export interface ICancelPaymentResponse {
	id: string;
	status: string;
	canceledAt: Date;
}

export interface IRefundPaymentResponse {
	id: string;
	paymentId: string;
	amount: number;
	currency: string;
	status: string;
	reason?: string;
	refundedAt: Date;
}

export interface IPaymentDetails {
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
}

export interface ICustomerResponse {
	id: string;
	email?: string;
	name?: string;
	phone?: string;
	createdAt: Date;
	updatedAt: Date;
	metadata?: Record<string, string>;
}

export interface IWebhookEvent {
	id: string;
	type: string;
	data: unknown;
	createdAt: Date;
}

export interface IPaymentProvider {
	/**
	 * Initialize the payment provider with configuration
	 */
	initialize(config: IPaymentProviderConfig): Promise<void>;

	/**
	 * Process a payment
	 */
	processPayment(
		paymentData: ProcessPaymentDto,
		options?: IPaymentProviderOptions,
	): Promise<ICreatePaymentResponse>;

	/**
	 * Capture a previously authorized payment
	 */
	capturePayment(
		paymentId: string,
		options?: ICapturePaymentOptions,
	): Promise<ICapturePaymentResponse>;

	/**
	 * Cancel a payment (void an authorization)
	 */
	cancelPayment(
		paymentId: string,
		options?: IPaymentProviderOptions,
	): Promise<ICancelPaymentResponse>;

	/**
	 * Refund a payment
	 */
	refundPayment(
		paymentId: string,
		options?: IRefundPaymentOptions,
	): Promise<IRefundPaymentResponse>;

	/**
	 * Retrieve payment details
	 */
	retrievePayment(
		paymentId: string,
		options?: IPaymentProviderOptions,
	): Promise<IPaymentDetails>;

	/**
	 * Create a payment method
	 */
	createPaymentMethod(
		paymentMethodData: CreatePaymentMethodDto,
		options?: IPaymentProviderOptions,
	): Promise<PaymentMethodResponseDto>;

	/**
	 * Update a payment method
	 */
	updatePaymentMethod(
		paymentMethodId: string,
		data: IPaymentMethodUpdateData,
		options?: IPaymentProviderOptions,
	): Promise<PaymentMethodResponseDto>;

	/**
	 * Delete a payment method
	 */
	deletePaymentMethod(
		paymentMethodId: string,
		options?: IPaymentProviderOptions,
	): Promise<boolean>;

	/**
	 * Create a customer in the payment provider
	 */
	createCustomer(
		customerData: ICustomerData,
		options?: IPaymentProviderOptions,
	): Promise<ICustomerResponse>;

	/**
	 * Update customer data in the payment provider
	 */
	updateCustomer(
		customerId: string,
		customerData: ICustomerData,
		options?: IPaymentProviderOptions,
	): Promise<ICustomerResponse>;

	/**
	 * Generate a client token for client-side payment processing
	 */
	generateClientToken(
		customerId?: string,
		options?: IPaymentProviderOptions,
	): Promise<string>;

	/**
	 * Validate a webhook event
	 */
	validateWebhook(payload: unknown, signature: string): Promise<boolean>;

	/**
	 * Parse a webhook event
	 */
	parseWebhookEvent(
		payload: unknown,
		signature: string,
	): Promise<IWebhookEvent>;
}

/**
 * Interface for card details used when processing payments
 */
export interface ICardDetails {
	number: string;
	expiryMonth: string;
	expiryYear: string;
	cvc: string;
	name?: string;
}

export interface IStripeSetupIntentResponse {
	id: string;
	clientSecret: string;
	status: string;
	customerId: string;
	createdAt: Date;
}

export interface IStripeProvider extends IPaymentProvider {
	attachPaymentMethodToCustomer(
		customerId: string,
		paymentMethodId: string,
	): Promise<PaymentMethodResponseDto>;

	createSetupIntent(
		customerId: string,
		options?: IPaymentProviderOptions,
	): Promise<IStripeSetupIntentResponse>;
}

export interface IBillingAgreementResponse {
	id: string;
	token?: string;
	status: string;
	customerId: string;
	redirectUrl?: string;
	createdAt: Date;
}

export interface IPayPalProvider extends IPaymentProvider {
	createBillingAgreement(
		customerId: string,
		options?: IPaymentProviderOptions,
	): Promise<IBillingAgreementResponse>;

	executeBillingAgreement(
		token: string,
		options?: IPaymentProviderOptions,
	): Promise<IBillingAgreementResponse>;
}
