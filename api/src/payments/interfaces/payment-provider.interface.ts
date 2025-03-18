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
	[key: string]: any;
}

export interface IPaymentProviderOptions {
	idempotencyKey?: string;
	[key: string]: any;
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
	): Promise<any>;

	/**
	 * Cancel a payment (void an authorization)
	 */
	cancelPayment(
		paymentId: string,
		options?: IPaymentProviderOptions,
	): Promise<any>;

	/**
	 * Refund a payment
	 */
	refundPayment(
		paymentId: string,
		options?: IRefundPaymentOptions,
	): Promise<any>;

	/**
	 * Retrieve payment details
	 */
	retrievePayment(
		paymentId: string,
		options?: IPaymentProviderOptions,
	): Promise<any>;

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
		data: any,
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
		customerData: any,
		options?: IPaymentProviderOptions,
	): Promise<any>;

	/**
	 * Update customer data in the payment provider
	 */
	updateCustomer(
		customerId: string,
		customerData: any,
		options?: IPaymentProviderOptions,
	): Promise<any>;

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
	validateWebhook(payload: any, signature: string): Promise<boolean>;

	/**
	 * Parse a webhook event
	 */
	parseWebhookEvent(payload: any, signature: string): Promise<any>;
}

export interface IStripeProvider extends IPaymentProvider {
	attachPaymentMethodToCustomer(
		customerId: string,
		paymentMethodId: string,
	): Promise<any>;

	createSetupIntent(
		customerId: string,
		options?: IPaymentProviderOptions,
	): Promise<any>;
}

export interface IPayPalProvider extends IPaymentProvider {
	createBillingAgreement(
		customerId: string,
		options?: IPaymentProviderOptions,
	): Promise<any>;

	executeBillingAgreement(
		token: string,
		options?: IPaymentProviderOptions,
	): Promise<any>;
}
