import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { Payment } from "./payment.entity";

export enum TransactionType {
	PAYMENT = "PAYMENT",
	REFUND = "REFUND",
	CHARGEBACK = "CHARGEBACK",
}

export enum TransactionStatus {
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
	PENDING = "PENDING",
}

@ObjectType()
export class Transaction {
	@Field(() => ID)
	id: string;

	@Field()
	paymentId: string;

	@Field()
	userId: string;

	@Field(() => Float)
	amount: number;

	@Field()
	type: TransactionType;

	@Field()
	status: TransactionStatus;

	@Field({ nullable: true })
	providerTransactionId: string;

	@Field(() => String, { nullable: true })
	providerResponse: string;

	@Field(() => Payment)
	payment: Payment;

	@Field(() => User)
	user: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
