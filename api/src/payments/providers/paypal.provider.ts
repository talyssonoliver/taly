import { Injectable, Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import * as paypal from "@paypal/checkout-server-sdk";
import type {
	IPaymentProvider,
	IPaymentProviderOptions,
} from "../interfaces/payment-provider.interface";
import type { CardDetails } from "../interfaces/payment-provider.interface";
import type { CreatePaymentMethodDto } from "../dto/create-payment-method.dto";
import type { PaymentMethodResponseDto } from "../dto/payment-method-response.dto";

@Injectable()
export class PaypalProvider implements IPaymentProvider {
	private readonly logger = new Logger(PaypalProvider.name);
	private readonly client: paypal.core.PayPalHttpClient;

	constructor(private readonly configService: ConfigService) {
		const environment =
			this.configService.get<string>("NODE_ENV") === "production"
				? new paypal.core.LiveEnvironment(
						this.configService.get<string>("PAYPAL_CLIENT_ID"),
						this.configService.get<string>("PAYPAL_CLIENT_SECRET"),
					)
				: new paypal.core.SandboxEnvironment(
						this.configService.get<string>("PAYPAL_CLIENT_ID"),
						this.configService.get<string>("PAYPAL_CLIENT_SECRET"),
					);

		this.client = new paypal.core.PayPalHttpClient(environment);
	}

	async processPaymentWithToken(
		paymentId: string,
		amount: number,
		token: string,
		description: string,
	): Promise<Record<string, unknown>> {
		try {
			this.logger.log("Processing PayPal payment with token for payment");

			const request = new paypal.orders.OrdersCaptureRequest(token);
			request.requestBody({});

			const response = await this.client.execute(request);

			if (response.result.status !== "COMPLETED") {
				throw new Error("PayPal payment failed");
			}

			return {
				transactionId: response.result.id,
				status: response.result.status,
				response: JSON.stringify(response.result),
			};
		} catch (error) {
			this.logger.error("PayPal payment processing error:");
			throw error;
		}
	}

	async processPaymentWithCard(
		paymentId: string,
		amount: number,
		cardDetails: CardDetails,
		description: string,
	): Promise<Record<string, unknown>> {
		this.logger.error("PayPal direct card processing not implemented");
		throw new Error("PayPal direct card processing not implemented");
	}

	async processPaymentWithSavedMethod(
		paymentId: string,
		amount: number,
		paymentMethodId: string,
		description: string,
	): Promise<Record<string, unknown>> {
		try {
			this.logger.log(
				`Processing PayPal payment with saved method for payment ${paymentId}`,
			);

			// For PayPal, paymentMethodId is the vault ID
			const request = new paypal.payments.PaymentsVaultRequest();
			request.requestBody({
				intent: "CAPTURE",
				payment_source: {
					token: {
						id: paymentMethodId,
						type: "PAYMENT_METHOD_TOKEN",
					},
				},
				purchase_units: [
					{
						amount: {
							currency_code: "GBP",
							value: amount.toFixed(2),
						},
						description,
						custom_id: paymentId,
					},
				],
			});

			const response = await this.client.execute(request);

			return {
				transactionId: response.result.id,
				status: response.result.status,
				response: JSON.stringify(response.result),
			};
		} catch (error) {
			this.logger.error(
				`PayPal payment processing error: ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	async refundPayment(
		transactionId: string,
		amount: number,
		reason?: string,
	): Promise<Record<string, unknown>> {
		try {
			this.logger.log(
				`Processing PayPal refund for transaction ${transactionId}`,
			);

			const captureId = await this.getCaptureIdFromOrder(transactionId);

			if (!captureId) {
				throw new Error("Cannot find capture ID for refund");
			}

			const request = new paypal.payments.CapturesRefundRequest(captureId);
			request.requestBody({
				amount: {
					currency_code: "USD",
					value: amount.toFixed(2),
				},
				note_to_payer: reason || "Refund",
			});

			const response = await this.client.execute(request);

			return {
				transactionId: response.result.id,
				status: response.result.status,
				response: JSON.stringify(response.result),
			};
		} catch (error) {
			this.logger.error(
				`PayPal refund processing error: ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	async validateToken(token: string): Promise<Record<string, unknown>> {
		try {
			this.logger.log("Validating PayPal token");

			// For PayPal, we can't get details without making a payment, so we just return placeholder values
			return {
				lastFour: "N/A",
				expiryMonth: "N/A",
				expiryYear: "N/A",
				cardBrand: "PayPal",
			};
		} catch (error) {
			this.logger.error("PayPal token validation error:", error);
			throw error;
		}
	}

	async createCustomer(email: string, name: string): Promise<string> {
		// PayPal doesn't have a direct customer creation API
		return "paypal-customer";
	}

	async createPaymentMethod(
		paymentMethodData: CreatePaymentMethodDto,
		options?: IPaymentProviderOptions,
	): Promise<PaymentMethodResponseDto> {
		this.logger.error("PayPal direct payment method creation not implemented");
		throw new Error("PayPal direct payment method creation not implemented");
	}

	private async getCaptureIdFromOrder(orderId: string): Promise<string | null> {
		try {
			const request = new paypal.orders.OrdersGetRequest(orderId);
			const response = await this.client.execute(request);

			const purchaseUnit = response.result.purchase_units[0];
			if (purchaseUnit?.payments?.captures) {
				return purchaseUnit.payments.captures[0].id;
			}

			return null;
		} catch (error) {
			this.logger.error(
				`Error getting capture ID: ${error instanceof Error ? error.message : String(error)}`,
			);
			return null;
		}
	}
}
