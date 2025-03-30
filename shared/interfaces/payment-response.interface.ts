export interface PaymentResponse {
	id: string;
	status: "completed" | "pending" | "failed";
	amount: number;
	currency: string;
	transactionId: string;
	paymentMethod: string;
	createdAt: Date;
	metadata?: Record<string, unknown>;
}
