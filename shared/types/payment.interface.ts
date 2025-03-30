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
	amount: number;
	currency: string;
	status: "pending" | "completed" | "failed";
	bookingId: string;
	createdAt: string;
	updatedAt: string;
}

export type CreatePaymentParams = Omit<
	Payment,
	"id" | "createdAt" | "updatedAt"
>;

export type UpdatePaymentParams = Partial<
	Omit<Payment, "id" | "createdAt" | "updatedAt" | "appointmentId">
>;
