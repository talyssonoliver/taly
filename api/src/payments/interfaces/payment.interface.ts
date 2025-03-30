import type { User } from "../../users/entities/user.entity";
import type { Payment as PaymentEntity } from "../entities/payment.entity";
import type { PaymentStatus } from "../enums/payment-status.enum";

export type PaymentMethod = {
	id: string;
	type: string;
	last4?: string;
	brand?: string;
	expMonth?: number;
	expYear?: string;
	bankName?: string;
	accountType?: string;
	metadata?: Record<string, unknown>;
};

export type PaymentRefund = {
	id: string;
	amount: number;
	status: string;
	reason?: string;
	reasonDetails?: string;
	createdAt: Date;
	metadata?: Record<string, unknown>;
	externalId?: string;
};

/**
 * Basic payment response from a payment provider
 */
export type PaymentProviderResponse = {
	transactionId: string;
	status: string;
	response: string;
	providerId?: string;
};

export type PaymentData = {
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
	paymentMethod: PaymentMethod;
	externalId?: string;
	provider?: string;
	errorMessage?: string;
	refunds?: PaymentRefund[];
	metadata?: Record<string, unknown>;
	receiptUrl?: string;
	liveMode: boolean;
	transactionId?: string;
};

export type PaymentWithTransactions = PaymentData & {
	transactions: Array<{
		id: string;
		type: string;
		amount: number;
		status: string;
		createdAt: Date;
		metadata?: Record<string, unknown>;
	}>;
};

export type CreatePaymentOptions = {
	idempotencyKey?: string;
	statementDescriptor?: string;
	receiptEmail?: string;
	sendReceipt?: boolean;
	captureMethod?: "automatic" | "manual";
	confirmationMethod?: "automatic" | "manual";
};

export type ServiceCreatePaymentResponse = {
	payment: PaymentData;
	requiresAction?: boolean;
	clientSecret?: string;
	nextAction?: {
		type: string;
		redirectUrl?: string;
	};
};

export type CapturePaymentOptions = {
	amount?: number;
	metadata?: Record<string, unknown>;
};

export type RefundPaymentOptions = {
	amount?: number;
	reason?: string;
	reasonDetails?: string;
	refundApplicationFee?: boolean;
	metadata?: Record<string, unknown>;
};

/**
 * Payment Service Interface
 */
export interface PaymentServiceInterface {
	createPayment(
		amount: number,
		userId: string,
		appointmentId: string,
		provider?: string,
	): Promise<PaymentEntity>;

	processPayment(
		id: string,
		paymentMethodId: string,
		user: User,
	): Promise<PaymentEntity>;

	refundPayment(id: string, amount?: number): Promise<PaymentEntity>;

	getPaymentById(id: string): Promise<PaymentEntity>;

	getPaymentsByUserId(userId: string): Promise<PaymentEntity[]>;

	getPaymentsByAppointmentId(appointmentId: string): Promise<PaymentEntity[]>;
}

export type IPayment = PaymentServiceInterface;

export type PaymentType = PaymentEntity;
