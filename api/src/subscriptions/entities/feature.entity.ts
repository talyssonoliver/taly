import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Plan } from "./plan.entity";

@ObjectType()
export class Feature {
	@Field(() => ID)
	id: string;

	@Field()
	name: string;

	@Field()
	value: any;

	@Field({ nullable: true })
	description: string;

	@Field({ nullable: true })
	featureCode: string;

	@Field(() => Plan)
	plan: Plan; // Join handled by Prisma schema

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
