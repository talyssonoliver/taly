import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Website } from "./website.entity";

@ObjectType()
export class CustomDomain {
	@Field(() => ID)
	id: string;

	@Field()
	websiteId: string;

	@Field(() => Website)
	website: Website;

	@Field()
	domain: string;

	@Field()
	status: "pending" | "active" | "failed" | "verifying";

	@Field()
	sslEnabled: boolean;

	@Field(() => [GraphQLJSONObject])
	dnsRecords: {
		type: string;
		name: string;
		value: string;
		ttl: number;
	}[];

	@Field({ nullable: true })
	verifiedAt?: Date;

	@Field({ nullable: true })
	errorMessage?: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
