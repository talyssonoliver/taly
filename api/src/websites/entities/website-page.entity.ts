import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Website } from "./website.entity";

@ObjectType()
export class WebsitePage {
	@Field(() => ID)
	id: string;

	@Field()
	title: string;

	@Field()
	path: string;

	@Field(() => GraphQLJSONObject)
	content: Record<string, unknown>;

	@Field()
	isPublished: boolean;

	@Field()
	metaTitle: string;

	@Field()
	metaDescription: string;

	@Field()
	sortOrder: number;

	@Field(() => Website)
	website: Website;

	@Field()
	websiteId: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
