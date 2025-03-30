import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BillingPeriod } from "../constants/subscription.constants";
import { Feature } from "./feature.entity";

@ObjectType()
export class Plan {
	@Field(() => ID)
	id: string;

	@Field()
	name: string;

	@Field()
	description: string;

	@Field()
	price: number;

	@Field()
	billingPeriod: BillingPeriod;

	@Field()
	isActive: boolean;

	@Field(() => [Feature])
	features: Feature[];

	@Field({ nullable: true })
	metadata: Record<string, any>;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
