import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import {
	BillingPeriod,
	SubscriptionStatus,
} from "../constants/subscription.constants";
import { Plan } from "./plan.entity";

@ObjectType()
export class Subscription {
	@Field(() => ID)
	id: string;

	@Field()
	userId: string;

	@Field(() => Plan)
	plan: Plan;

	@Field()
	status: SubscriptionStatus;

	@Field()
	startDate: Date;

	@Field({ nullable: true })
	endDate: Date;

	@Field({ nullable: true })
	renewalDate: Date;

	@Field({ nullable: true })
	cancelledAt: Date;

	@Field(() => Float)
	price: number;

	@Field()
	currency: string;

	@Field()
	billingPeriod: BillingPeriod;

	@Field({ nullable: true })
	paymentMethodId: string;

	@Field({ nullable: true })
	nextInvoiceId: string;

	@Field()
	metadata: Record<string, any>;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}


