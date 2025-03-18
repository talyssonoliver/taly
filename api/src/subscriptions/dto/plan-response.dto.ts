import { ApiProperty } from "@nestjs/swagger";
import { Field, ObjectType } from "@nestjs/graphql";
import { BillingPeriod } from "../constants/subscription.constants";

@ObjectType()
class FeatureDto {
	@ApiProperty({
		description: "Feature ID",
		example: "5d91d064-b4c8-48a0-8d13-b987c7aa58de",
	})
	@Field()
	id: string;

	@ApiProperty({
		description: "Feature name",
		example: "Storage",
	})
	@Field()
	name: string;

	@ApiProperty({
		description: "Feature value",
		example: { amount: 10, unit: "GB" },
	})
	@Field()
	value: any;
}

@ObjectType()
export class PlanResponseDto {
	@ApiProperty({
		description: "Plan ID",
		example: "7a9d25a1-8dfa-456c-8c82-8ddc190b74b8",
	})
	@Field()
	id: string;

	@ApiProperty({
		description: "Plan name",
		example: "Premium",
	})
	@Field()
	name: string;

	@ApiProperty({
		description: "Plan description",
		example: "Premium plan with advanced features",
		nullable: true,
	})
	@Field({ nullable: true })
	description: string | null;

	@ApiProperty({
		description: "Plan price",
		example: 19.99,
	})
	@Field()
	price: number;

	@ApiProperty({
		description: "Currency",
		example: "GBP",
	})
	@Field()
	currency: string;

	@ApiProperty({
		description: "Billing period",
		enum: BillingPeriod,
		example: BillingPeriod.MONTHLY,
	})
	@Field()
	billingPeriod: BillingPeriod;

	@ApiProperty({
		description: "Plan active status",
		example: true,
	})
	@Field()
	isActive: boolean;

	@ApiProperty({
		description: "Features included in the plan",
		type: [FeatureDto],
	})
	@Field(() => [FeatureDto])
	features: FeatureDto[];
}
