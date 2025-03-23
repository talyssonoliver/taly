import { Injectable, Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import type {
	IPaymentProvider,
	ICustomerData,
	ICustomerResponse,
	IPaymentProviderOptions,
	IRefundPaymentResponse,
	IPaymentProviderConfig,
	ICapturePaymentResponse,
	ICancelPaymentResponse,
	IPaymentDetails,
	IPaymentMethodUpdateData,
	IWebhookEvent,
	ICardDetails,
} from "../interfaces/payment-provider.interface";
import type {
	CreatePaymentMethodDto,
	PaymentMethodResponseDto,
	ProcessPaymentDto,
} from "../dto";
import type {
	IRefundPaymentOptions,
	ICapturePaymentOptions,
	ICreatePaymentResponse,
	IPayment,
	IProviderPaymentResponse,
} from "../interfaces/payment.interface";
import { PaymentStatus } from "../enums/payment-status.enum";

@Injectable()
export class StripeProvider implements IPaymentProvider {
	private readonly logger = new Logger(StripeProvider.name);
	private readonly stripe: Stripe;
	private readonly currency: string;

	constructor(private readonly configService: ConfigService) {
		const secretKey = this.configService.get<string>("STRIPE_SECRET_KEY");
		if (!secretKey) {
			throw new Error(
				"STRIPE_SECRET_KEY is not defined in environment variables",
			);
		}
		this.stripe = new Stripe(secretKey, {
			apiVersion: (this.configService.get<string>("STRIPE_API_VERSION") ||
				"2022-11-15") as Stripe.LatestApiVersion,
		});
		this.currency = this.configService.get<string>("PAYMENT_CURRENCY") || "gbp";
	}

	/**
	 * Initialize the payment provider with configuration
	 */
	async initialize(config: IPaymentProviderConfig): Promise<void> {
		this.logger.log("Initializing Stripe provider");
		// Already initialized in constructor, but we implement this for interface compatibility
	}

	/**
	 * Process a payment
	 */
	async processPayment(
		paymentData: ProcessPaymentDto,
		options?: IPaymentProviderOptions,
	): Promise<ICreatePaymentResponse> {
		try {
			this.logger.log("Processing Stripe payment");

			let paymentResponse: IProviderPaymentResponse;
			const paymentId = paymentData.paymentMethodId || "unknown";

			if (paymentData.paymentMethodId) {
				// Process with saved payment method
				paymentResponse = await this.processPaymentWithSavedMethod(
					paymentId,
					paymentData.amount,
					paymentData.paymentMethodId,
					paymentData.description || "",
				);
			} else if (paymentData.paymentToken?.id) {
				// Process with token
				paymentResponse = await this.processPaymentWithToken(
					paymentId,
					paymentData.amount,
					paymentData.paymentToken.id,
					paymentData.description || "",
				);
			} else if (paymentData.cardDetails) {
				// Process with card details
				const cardDetails = {
					number: paymentData.cardDetails.number,
					expiryMonth: paymentData.cardDetails.expMonth.toString(),
					expiryYear: paymentData.cardDetails.expYear.toString(),
					cvc: paymentData.cardDetails.cvc,
				};

				paymentResponse = await this.processPaymentWithCard(
					paymentId,
					paymentData.amount,
					cardDetails,
					paymentData.description || "",
				);
			} else {
				throw new Error("No payment method provided");
			}

			// Create payment object with correct types
			const payment: IPayment = {
				id: paymentResponse.transactionId,
				amount: paymentData.amount,
				currency: this.currency,
				status: this.mapStripeStatusToPaymentStatus(paymentResponse.status),
				paymentMethod: {
					id: paymentData.paymentMethodId || "unknown",
					type: "card",
				},
				userId: paymentData.customerId || "unknown",
				description: paymentData.description || "Payment processed via Stripe",
				metadata: options?.metadata as Record<string, unknown>,
				createdAt: new Date(),
				liveMode: true,
			};

			// Convert to expected ICreatePaymentResponse format
			return {
				payment,
				clientSecret: undefined,
				requiresAction: false,
			};
		} catch (error) {
			this.logger.error(`Stripe payment processing error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Process a payment using a Stripe payment method token
	 */
	async processPaymentWithToken(
		paymentId: string,
		amount: number,
		token: string,
		description: string,
	): Promise<IProviderPaymentResponse> {
		try {
			this.logger.log(
				`Processing Stripe payment with token for payment ${paymentId}`,
			);

			const paymentIntent = await this.createPaymentIntent(
				amount,
				token,
				description,
				paymentId,
			);

			return this.formatPaymentResponse(paymentIntent);
		} catch (error) {
			this.logger.error(`Stripe payment processing error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Process a payment using card details
	 */
	async processPaymentWithCard(
		paymentId: string,
		amount: number,
		cardDetails: ICardDetails,
		description: string,
	): Promise<IProviderPaymentResponse> {
		try {
			this.logger.log(
				`Processing Stripe payment with card for payment ${paymentId}`,
			);

			// Create a payment method from card details
			const paymentMethod = await this.createCardPaymentMethod(cardDetails);

			// Create payment intent using the payment method
			const paymentIntent = await this.createPaymentIntent(
				amount,
				paymentMethod.id,
				description,
				paymentId,
			);

			return this.formatPaymentResponse(paymentIntent);
		} catch (error) {
			this.logger.error(`Stripe payment processing error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Process a payment using a saved payment method
	 */
	async processPaymentWithSavedMethod(
		paymentId: string,
		amount: number,
		paymentMethodId: string,
		description: string,
	): Promise<IProviderPaymentResponse> {
		try {
			this.logger.log(
				`Processing Stripe payment with saved method for payment ${paymentId}`,
			);

			const paymentIntent = await this.createPaymentIntent(
				amount,
				paymentMethodId,
				description,
				paymentId,
			);

			return this.formatPaymentResponse(paymentIntent);
		} catch (error) {
			this.logger.error(`Stripe payment processing error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Capture a previously authorized payment
	 */
	async capturePayment(
		paymentId: string,
		options?: ICapturePaymentOptions,
	): Promise<ICapturePaymentResponse> {
		try {
			this.logger.log(`Capturing Stripe payment: ${paymentId}`);

			const amount = options?.amount;

			const paymentIntent = await this.stripe.paymentIntents.capture(
				paymentId,
				{
					amount_to_capture: amount ? Math.round(amount * 100) : undefined,
				},
			);

			return {
				id: paymentIntent.id,
				status: paymentIntent.status,
				amount: (paymentIntent.amount_capturable || 0) / 100,
				currency: paymentIntent.currency,
				capturedAt: new Date(),
				metadata: paymentIntent.metadata ? { ...paymentIntent.metadata } : {},
			};
		} catch (error) {
			this.logger.error(`Stripe capture error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Cancel a payment (void an authorization)
	 */
	async cancelPayment(
		paymentId: string,
		options?: IPaymentProviderOptions,
	): Promise<ICancelPaymentResponse> {
		try {
			this.logger.log(`Canceling Stripe payment: ${paymentId}`);

			const paymentIntent = await this.stripe.paymentIntents.cancel(paymentId);

			return {
				id: paymentIntent.id,
				status: paymentIntent.status,
				canceledAt: new Date(),
			};
		} catch (error) {
			this.logger.error(`Stripe cancellation error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Refund a payment
	 */
	async refundPayment(
		paymentId: string,
		options?: IRefundPaymentOptions,
	): Promise<IRefundPaymentResponse> {
		try {
			this.logger.log(`Processing Stripe refund for transaction ${paymentId}`);

			const amount = options?.amount || 0;
			const reason = options?.reason;

			const refund = await this.stripe.refunds.create({
				payment_intent: paymentId,
				amount: Math.round(amount * 100), // Stripe requires amount in cents
				reason: this.mapRefundReason(reason),
			});

			return {
				id: refund.id,
				paymentId: paymentId,
				amount: amount,
				currency: this.currency,
				status: refund.status || "unknown",
				reason: reason,
				refundedAt: new Date(),
			};
		} catch (error) {
			this.logger.error(`Stripe refund processing error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Retrieve payment details
	 */
	async retrievePayment(
		paymentId: string,
		options?: IPaymentProviderOptions,
	): Promise<IPaymentDetails> {
		try {
			this.logger.log(`Retrieving Stripe payment: ${paymentId}`);

			const paymentIntent =
				await this.stripe.paymentIntents.retrieve(paymentId);

			return {
				id: paymentIntent.id,
				status: paymentIntent.status,
				amount: paymentIntent.amount / 100,
				currency: paymentIntent.currency,
				customerId: (paymentIntent.customer as string) || undefined,
				paymentMethodId: (paymentIntent.payment_method as string) || undefined,
				description: paymentIntent.description || undefined,
				metadata: paymentIntent.metadata ? { ...paymentIntent.metadata } : {},
				createdAt: new Date(paymentIntent.created * 1000),
				updatedAt: new Date(),
				capturedAt: paymentIntent.amount_received ? new Date() : undefined,
				canceledAt: paymentIntent.canceled_at
					? new Date(paymentIntent.canceled_at * 1000)
					: undefined,
			};
		} catch (error) {
			this.logger.error(`Stripe payment retrieval error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Validate a payment token
	 */
	async validateToken(token: string): Promise<{
		lastFour: string;
		expiryMonth: string;
		expiryYear: string;
		cardBrand: string;
	}> {
		try {
			this.logger.log("Validating Stripe token");

			// Get payment method details
			const paymentMethod = await this.stripe.paymentMethods.retrieve(token);

			if (!paymentMethod || !paymentMethod.card) {
				throw new Error("Invalid payment method");
			}

			return {
				lastFour: paymentMethod.card.last4,
				expiryMonth: paymentMethod.card.exp_month.toString(),
				expiryYear: paymentMethod.card.exp_year.toString(),
				cardBrand: paymentMethod.card.brand,
			};
		} catch (error) {
			this.logger.error(`Stripe token validation error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Create a Stripe customer
	 */
	async createCustomer(
		customerData: ICustomerData,
		options?: IPaymentProviderOptions,
	): Promise<ICustomerResponse> {
		try {
			this.logger.log(`Creating Stripe customer for ${customerData.email}`);

			const customer = await this.stripe.customers.create({
				email: customerData.email || undefined,
				name: customerData.name || undefined,
				phone: customerData.phone || undefined,
				metadata: customerData.metadata,
			});

			return {
				id: customer.id,
				email: customer.email === null ? undefined : customer.email,
				name: customer.name === null ? undefined : customer.name,
				phone: customer.phone === null ? undefined : customer.phone,
				createdAt: new Date(customer.created * 1000),
				updatedAt: new Date(),
				metadata: customer.metadata ? { ...customer.metadata } : {},
			};
		} catch (error) {
			this.logger.error(`Stripe customer creation error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Update customer data in the payment provider
	 */
	async updateCustomer(
		customerId: string,
		customerData: ICustomerData,
		options?: IPaymentProviderOptions,
	): Promise<ICustomerResponse> {
		try {
			this.logger.log(`Updating Stripe customer: ${customerId}`);

			const customer = await this.stripe.customers.update(customerId, {
				email: customerData.email,
				name: customerData.name,
				phone: customerData.phone,
				metadata: customerData.metadata,
			});

			return {
				id: customer.id,
				email: customer.email === null ? undefined : customer.email,
				name: customer.name === null ? undefined : customer.name,
				phone: customer.phone === null ? undefined : customer.phone,
				createdAt: new Date(customer.created * 1000),
				updatedAt: new Date(),
				metadata: customer.metadata ? { ...customer.metadata } : {},
			};
		} catch (error) {
			this.logger.error(`Stripe customer update error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Create a payment method and attach to a customer
	 */
	async createPaymentMethod(
		paymentMethodData: CreatePaymentMethodDto,
		options?: IPaymentProviderOptions,
	): Promise<PaymentMethodResponseDto> {
		try {
			this.logger.log(
				`Creating Stripe payment method for user ${paymentMethodData.userId}`,
			);

			let stripePaymentMethod: Stripe.PaymentMethod;

			// Check what type of payment method we're creating
			if (paymentMethodData.type === "card" && paymentMethodData.card) {
				// Create card payment method
				stripePaymentMethod = await this.stripe.paymentMethods.create({
					type: "card",
					card: {
						number: paymentMethodData.card.number,
						exp_month: paymentMethodData.card.expMonth,
						exp_year: paymentMethodData.card.expYear,
						cvc: paymentMethodData.card.cvc,
					},
				});
			} else if (
				paymentMethodData.type === "bank_account" &&
				paymentMethodData.bankAccount
			) {
				// For bank account, you might need to use a different Stripe API
				// This is simplified example
				throw new Error("Bank account payment methods not supported");
			} else {
				throw new Error("Invalid payment method data");
			}

			// Return properly formatted response
			return {
				id: stripePaymentMethod.id,
				userId: paymentMethodData.userId,
				type: paymentMethodData.type,
				card: stripePaymentMethod.card
					? {
							brand: stripePaymentMethod.card.brand,
							last4: stripePaymentMethod.card.last4,
							expMonth: stripePaymentMethod.card.exp_month,
							expYear: stripePaymentMethod.card.exp_year,
						}
					: undefined,
				isDefault: paymentMethodData.isDefault || false,
				createdAt: new Date(),
				updatedAt: new Date(),
				processor: "stripe",
			};
		} catch (error) {
			this.logger.error(
				`Stripe payment method creation error: ${error.message}`,
			);
			throw error;
		}
	}

	/**
	 * Update a payment method
	 */
	async updatePaymentMethod(
		paymentMethodId: string,
		data: IPaymentMethodUpdateData,
		options?: IPaymentProviderOptions,
	): Promise<PaymentMethodResponseDto> {
		try {
			this.logger.log(`Updating Stripe payment method: ${paymentMethodId}`);

			// First get the existing payment method to maintain type info
			const existingMethod =
				await this.stripe.paymentMethods.retrieve(paymentMethodId);

			// Update payment method with Stripe
			const paymentMethod = await this.stripe.paymentMethods.update(
				paymentMethodId,
				{
					billing_details: data.billingDetails
						? {
								name: data.billingDetails.name,
								email: data.billingDetails.email,
								phone: data.billingDetails.phone,
								address: data.billingDetails.address
									? {
											line1: data.billingDetails.address.line1,
											line2: data.billingDetails.address.line2,
											city: data.billingDetails.address.city,
											state: data.billingDetails.address.state,
											postal_code: data.billingDetails.address.postalCode,
											country: data.billingDetails.address.country,
										}
									: undefined,
							}
						: undefined,
					metadata: data.metadata,
				},
			);

			return {
				id: paymentMethod.id,
				userId: options?.userId as string,
				type: existingMethod.type === "card" ? "card" : "bank_account",
				card: paymentMethod.card
					? {
							brand: paymentMethod.card.brand,
							last4: paymentMethod.card.last4,
							expMonth: paymentMethod.card.exp_month,
							expYear: paymentMethod.card.exp_year,
						}
					: undefined,
				isDefault: (options?.isDefault as boolean) || false,
				createdAt: new Date(),
				updatedAt: new Date(),
				processor: "stripe",
			};
		} catch (error) {
			this.logger.error(`Stripe payment method update error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Delete a payment method
	 */
	async deletePaymentMethod(
		paymentMethodId: string,
		options?: IPaymentProviderOptions,
	): Promise<boolean> {
		try {
			this.logger.log(`Deleting Stripe payment method: ${paymentMethodId}`);

			const paymentMethod =
				await this.stripe.paymentMethods.detach(paymentMethodId);

			return !!paymentMethod.id;
		} catch (error) {
			this.logger.error(
				`Stripe payment method deletion error: ${error.message}`,
			);
			throw error;
		}
	}

	/**
	 * Generate a client token for client-side payment processing
	 */
	async generateClientToken(
		customerId?: string,
		options?: IPaymentProviderOptions,
	): Promise<string> {
		try {
			this.logger.log("Generating Stripe client token");

			// Stripe uses ephemeral keys for mobile clients
			// For web, we would typically create a SetupIntent or PaymentIntent
			if (customerId) {
				const ephemeralKey = await this.stripe.ephemeralKeys.create(
					{ customer: customerId },
					{ apiVersion: "2022-11-15" },
				);

				return ephemeralKey.secret || ""; // Ensure we return string not undefined
			}

			// For non-authenticated users, return empty string
			// This would be replaced with actual implementation based on use case
			return ""; // Return empty string instead of undefined
		} catch (error) {
			this.logger.error(
				`Stripe client token generation error: ${error.message}`,
			);
			throw error;
		}
	}

	/**
	 * Validate a webhook event
	 */
	async validateWebhook(payload: unknown, signature: string): Promise<boolean> {
		try {
			this.logger.log("Validating Stripe webhook");

			const webhookSecret = this.configService.get<string>(
				"STRIPE_WEBHOOK_SECRET",
			);

			if (!webhookSecret) {
				throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
			}

			// Convert payload to string if it's an object
			const payloadString =
				typeof payload === "string" ? payload : JSON.stringify(payload);

			// If this doesn't throw, the signature is valid
			this.stripe.webhooks.constructEvent(
				payloadString,
				signature,
				webhookSecret,
			);

			return true;
		} catch (error) {
			this.logger.error(`Stripe webhook validation error: ${error.message}`);
			return false;
		}
	}

	/**
	 * Parse a webhook event
	 */
	async parseWebhookEvent(
		payload: unknown,
		signature: string,
	): Promise<IWebhookEvent> {
		try {
			this.logger.log("Parsing Stripe webhook event");

			const webhookSecret = this.configService.get<string>(
				"STRIPE_WEBHOOK_SECRET",
			);

			if (!webhookSecret) {
				throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
			}

			// Convert payload to string if it's an object
			const payloadString =
				typeof payload === "string" ? payload : JSON.stringify(payload);

			const event = this.stripe.webhooks.constructEvent(
				payloadString,
				signature,
				webhookSecret,
			);

			return {
				id: event.id,
				type: event.type,
				data: event.data.object,
				createdAt: new Date(event.created * 1000),
			};
		} catch (error) {
			this.logger.error(`Stripe webhook parsing error: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Helper method to create a payment intent
	 */
	private async createPaymentIntent(
		amount: number,
		paymentMethodId: string,
		description: string,
		paymentId: string,
	): Promise<Stripe.PaymentIntent> {
		return this.stripe.paymentIntents.create({
			amount: Math.round(amount * 100), // Stripe requires amount in cents
			currency: this.currency,
			payment_method: paymentMethodId,
			confirm: true,
			description,
			metadata: {
				paymentId,
			},
		});
	}

	/**
	 * Helper method to create a card payment method
	 */
	private async createCardPaymentMethod(
		cardDetails: ICardDetails,
	): Promise<Stripe.PaymentMethod> {
		return this.stripe.paymentMethods.create({
			type: "card",
			card: {
				number: cardDetails.number,
				exp_month: Number.parseInt(cardDetails.expiryMonth, 10),
				exp_year: Number.parseInt(cardDetails.expiryYear, 10),
				cvc: cardDetails.cvc,
			},
		});
	}

	/**
	 * Helper method to format payment response
	 */
	private formatPaymentResponse(
		paymentIntent: Stripe.PaymentIntent,
	): IProviderPaymentResponse {
		return {
			transactionId: paymentIntent.id,
			status: paymentIntent.status,
			response: JSON.stringify(paymentIntent),
		};
	}

	/**
	 * Maps a generic reason string to Stripe refund reason
	 */
	private mapRefundReason(
		reason?: string,
	): "duplicate" | "fraudulent" | "requested_by_customer" | undefined {
		if (!reason) return undefined;

		if (
			reason.toLowerCase().includes("fraud") ||
			reason.toLowerCase().includes("suspicious")
		) {
			return "fraudulent";
		}

		if (reason.toLowerCase().includes("duplicate")) {
			return "duplicate";
		}

		if (
			reason.toLowerCase().includes("request") ||
			reason.toLowerCase().includes("asked")
		) {
			return "requested_by_customer";
		}

		return undefined;
	}

	/**
	 * Maps Stripe payment status to our PaymentStatus enum
	 */
	private mapStripeStatusToPaymentStatus(stripeStatus: string): PaymentStatus {
		switch (stripeStatus) {
			case "succeeded":
				return PaymentStatus.SUCCEEDED;
			case "processing":
				return PaymentStatus.PROCESSING;
			case "requires_payment_method":
				return PaymentStatus.PENDING;
			case "requires_confirmation":
				return PaymentStatus.PENDING;
			case "requires_action":
				return PaymentStatus.REQUIRES_ACTION;
			case "canceled":
				return PaymentStatus.CANCELED;
			default:
				return PaymentStatus.PENDING;
		}
	}
}
