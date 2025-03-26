import { Payment } from "./payment.interface";

export interface Refund {
	id: string;
	paymentId: string;
	amount: number;
	reason?: string | null;
	createdAt: Date;

	// Relations - optional, used for includes
	payment?: Payment;
}

export type CreateRefundParams = Omit<Refund, "id" | "createdAt">;