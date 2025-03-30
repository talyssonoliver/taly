import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { Payment } from "./payment.entity";

@ObjectType()
export class Refund {
	@Field(() => ID)
	id: string;

	@Field()
	paymentId: string;

	@Field(() => Float)
	amount: number;

	@Field()
	reason: string;

	@Field()
	status: string;

	@Field()
	issuedById: string;

	@Field(() => Payment)
	payment: Payment;

	@Field(() => User)
	issuedBy: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
