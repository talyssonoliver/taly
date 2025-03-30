import {
	Field,
	Float,
	ID,
	ObjectType,
	registerEnumType,
} from "@nestjs/graphql";
import { Appointment } from "../../appointments/entities/appointment.entity";
import { User } from "../../users/entities/user.entity";
import { Transaction } from "./transaction.entity";

export enum PaymentProvider {
	STRIPE = "STRIPE",
	PAYPAL = "PAYPAL",
	CASH = "CASH",
}

// Register enum with GraphQL
registerEnumType(PaymentProvider, {
	name: "PaymentProvider",
	description: "Payment provider types",
});

export enum PaymentStatus {
	PENDING = "PENDING",
	COMPLETED = "COMPLETED",
	FAILED = "FAILED",
	REFUNDED = "REFUNDED",
	CANCELLED = "CANCELLED",
}

registerEnumType(PaymentStatus, {
	name: "PaymentStatus",
	description: "Payment status types",
});

@ObjectType()
export class Payment {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	status: string;

	@Field(() => Float)
	amount: number;

	@Field(() => String)
	provider: string;

	@Field(() => String, { nullable: true })
	providerId?: string;

	@Field(() => String)
	appointmentId: string;

	@Field(() => String)
	userId: string;

	@Field(() => String, { nullable: true })
	paymentMethod?: string;

	@Field(() => String, { nullable: true })
	transactionId?: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	// Relationships
	@Field(() => User, { nullable: true })
	user?: User;

	@Field(() => Appointment, { nullable: true })
	appointment?: Appointment;

	@Field(() => [Transaction], { nullable: true })
	transactions?: Transaction[];

	addTransaction(transaction: Transaction) {
		if (!this.transactions) {
			this.transactions = [];
		}
		this.transactions.push(transaction);
	}

	addRefund(refund: Transaction) {
		if (!this.transactions) {
			this.transactions = [];
		}
		this.transactions.push(refund);
	}

	get isRefunded(): boolean {
		return this.transactions?.some((t) => t.type === "refund") || false;
	}

	get isPaid(): boolean {
		return (
			this.status === PaymentStatus.COMPLETED || this.status === "succeeded"
		);
	}
}
