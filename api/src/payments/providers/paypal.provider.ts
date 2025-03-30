import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { PaymentProvider } from "../interfaces/payment-provider.interface";

// Define return type interfaces to avoid anonymous return types
export interface PaypalTransactionResult {
	id: string;
	status: string;
	amount: {
		value: string;
		currency_code: string;
	};
	create_time: string;
	update_time: string;
}

export interface PaypalRefundResult {
	id: string;
	status: string;
	amount: {
		value: string;
		currency_code: string;
	};
	create_time: string;
	update_time: string;
}

export interface PaypalCaptureResult {
	id: string;
	status: string;
	amount: {
		value: string;
		currency_code: string;
	};
	final_capture: boolean;
	seller_protection: {
		status: string;
		dispute_categories: string[];
	};
	create_time: string;
	update_time: string;
}

interface PayPalRefundOptions {
	reason?: string;
	amount?: number;
}

interface PayPalApiResponse {
	id: string;
	status: string;
	links: Array<{ href: string; rel: string; method: string }>;
}

interface PayPalErrorResponse {
	name: string;
	message: string;
	details?: unknown[];
}

@Injectable()
export class PaypalProvider implements PaymentProvider {
	private readonly logger = new Logger(PaypalProvider.name);
	private readonly axiosInstance: AxiosInstance;
	private accessToken: string | null = null;
	private tokenExpiresAt = 0;

	constructor(private readonly configService: ConfigService) {
		this.axiosInstance = axios.create({
			baseURL: this.configService.get<string>("PAYPAL_API_URL"),
		});
	}

	async initialize(): Promise<void> {
		await this.getAccessToken();
	}

	async createPayment(
		amount: number,
		currency: string,
		description: string,
	): Promise<PaypalTransactionResult> {
		try {
			await this.ensureAccessToken();

			const response = await this.axiosInstance.post(
				"/v2/checkout/orders",
				{
					intent: "CAPTURE",
					purchase_units: [
						{
							amount: {
								currency_code: currency,
								value: amount.toString(),
							},
							description,
						},
					],
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.accessToken}`,
					},
				},
			);

			return response.data;
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`PayPal payment creation failed: ${errorMessage}`);
			throw error;
		}
	}

	async capturePayment(orderId: string): Promise<PaypalCaptureResult> {
		try {
			await this.ensureAccessToken();

			const response = await this.axiosInstance.post(
				`/v2/checkout/orders/${orderId}/capture`,
				{},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.accessToken}`,
					},
				},
			);

			return response.data;
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`PayPal capture payment failed: ${errorMessage}`);
			throw error;
		}
	}

	async refund(
		paymentId: string,
		amount?: number,
		reason?: string,
	): Promise<PaypalRefundResult> {
		try {
			await this.ensureAccessToken();

			const refundData: Record<string, unknown> = {};

			if (amount !== undefined) {
				refundData.amount = {
					value: amount.toString(),
					currency_code: "USD", // Default to USD or get from payment
				};
			}

			if (reason) {
				refundData.note_to_payer = reason;
			}

			const response = await this.axiosInstance.post(
				`/v2/payments/captures/${paymentId}/refund`,
				refundData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.accessToken}`,
					},
				},
			);

			return response.data;
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`PayPal refund failed: ${errorMessage}`);
			throw error;
		}
	}

	async getPaymentDetails(paymentId: string): Promise<PaypalTransactionResult> {
		try {
			await this.ensureAccessToken();

			const response = await this.axiosInstance.get(
				`/v2/checkout/orders/${paymentId}`,
				{
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				},
			);

			return response.data;
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`PayPal get payment details failed: ${errorMessage}`);
			throw error;
		}
	}

	async processRefund(
		paymentId: string,
		options?: PayPalRefundOptions,
	): Promise<boolean> {
		try {
			await this.ensureAccessToken();

			const response = await fetch(
				`${this.configService.get<string>("PAYPAL_API_URL")}/payments/capture/${paymentId}/refund`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.accessToken}`,
					},
					body: JSON.stringify(options || {}),
				},
			);

			const data = (await response.json()) as PayPalApiResponse;
			return data.status === "COMPLETED";
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown PayPal refund error";

			console.error("PayPal refund failed:", errorMessage);
			return false;
		}
	}

	private async getAccessToken(): Promise<void> {
		try {
			const clientId = this.configService.get<string>("PAYPAL_CLIENT_ID");
			const clientSecret = this.configService.get<string>(
				"PAYPAL_CLIENT_SECRET",
			);

			if (!clientId || !clientSecret) {
				throw new Error("PayPal credentials not configured");
			}

			const auth = Buffer.from(`${clientId}:${clientSecret}`).toString(
				"base64",
			);

			const response = await this.axiosInstance.post(
				"/v1/oauth2/token",
				"grant_type=client_credentials",
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${auth}`,
					},
				},
			);

			this.accessToken = response.data.access_token;
			this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

			this.logger.log("PayPal access token obtained");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`Failed to get PayPal access token: ${errorMessage}`);
			throw error;
		}
	}

	private async ensureAccessToken(): Promise<void> {
		if (!this.accessToken || Date.now() >= this.tokenExpiresAt) {
			await this.getAccessToken();
		}
	}
}
