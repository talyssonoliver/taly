import type { PaymentStatus } from "../enums/payment-status.enum"; 

export interface IPaymentMethod {
	id: string;
	type: string;
	last4?: string;
	brand?: string;
	expMonth?: number;
	expYear?: number;
	bankName?: string;
	accountType?: string;
	metadata?: Record<string, unknown>;
}

export interface IRefund {
	id: string;
	amount: number;
	status: string;
	reason?: string;
	reasonDetails?: string;
	createdAt: Date;
	metadata?: Record<string, unknown>;
	externalId?: string;
}

/**
 * Basic payment response from a payment provider
 */
export interface IProviderPaymentResponse {
	transactionId: string;
	status: string;
	response: string;
	providerId?: string;
}

export interface IPayment {
	id: string;
	amount: number;
	currency: string;
	status: PaymentStatus;
	createdAt: Date;
	updatedAt?: Date;
	userId: string;
	subscriptionId?: string;
	invoiceId?: string;
	description: string;
	paymentMethod: IPaymentMethod;
	externalId?: string;
	provider?: string;
	errorMessage?: string;
	refunds?: IRefund[];
	metadata?: Record<string, unknown>;
	receiptUrl?: string;
	liveMode: boolean;
	transactionId?: string;
}

export interface IPaymentWithTransactions extends IPayment {
	transactions: Array<{
		id: string;
		type: string;
		amount: number;
		status: string;
		createdAt: Date;
		metadata?: Record<string, unknown>;
	}>;
}

export interface ICreatePaymentOptions {
	idempotencyKey?: string;
	statementDescriptor?: string;
	receiptEmail?: string;
	sendReceipt?: boolean;
	captureMethod?: "automatic" | "manual";
	confirmationMethod?: "automatic" | "manual";
}

export interface ICreatePaymentResponse {
	payment: IPayment;
	requiresAction?: boolean;
	clientSecret?: string;
	nextAction?: {
		type: string;
		redirectUrl?: string;
	};
}

export interface ICapturePaymentOptions {
	amount?: number;
	metadata?: Record<string, unknown>;
}

export interface IRefundPaymentOptions {
	amount?: number;
	reason?: string;
	reasonDetails?: string;
	refundApplicationFee?: boolean;
	metadata?: Record<string, unknown>;
}
