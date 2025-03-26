import { Appointment } from "./appointment.interface";
import { Refund } from "./refund.interface";

export enum PaymentStatus {
	PENDING = "pending",
	PROCESSING = "processing",
	COMPLETED = "completed",
	FAILED = "failed",
	REFUNDED = "refunded",
	PARTIALLY_REFUNDED = "partially_refunded",
	CANCELLED = "cancelled",
}

export enum PaymentProvider {
	STRIPE = "stripe",
	PAYPAL = "paypal",
	SQUARE = "square",
}

export interface Payment {
	id: string;
	appointmentId: string;
	amount: number;
	status: PaymentStatus;
	paymentMethod?: string | null;
	transactionId?: string | null;
	provider: PaymentProvider;
	providerId?: string | null;
	createdAt: Date;
	updatedAt: Date;

	// Relations - optional, used for includes
	appointment?: Appointment;
	refunds?: Refund[];
}

export type CreatePaymentParams = Omit<
	Payment,
	"id" | "createdAt" | "updatedAt"
>;

export type UpdatePaymentParams = Partial<
	Omit<Payment, "id" | "createdAt" | "updatedAt" | "appointmentId">
>;