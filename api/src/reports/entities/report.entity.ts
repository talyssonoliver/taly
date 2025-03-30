import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Report {
	@Field(() => ID)
	id: string;

	@Field()
	type: string;

	@Field()
	title: string;

	@Field(() => String)
	data: Record<string, any>;

	@Field(() => String)
	filters: Record<string, any>;

	@Field()
	createdAt: Date; // Set in service

	@Field()
	updatedAt: Date; // Set in service
}
