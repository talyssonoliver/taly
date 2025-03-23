import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { User } from "../../users/entities/user.entity";
import { CustomDomain } from "./custom-domain.entity";
import { Page } from "./page.entity";
import { Theme } from "./theme.entity";

@ObjectType()
export class Website {
	@Field(() => ID)
	id: string;

	@Field()
	name: string;

	@Field({ nullable: true })
	description?: string;

	@Field()
	themeId: string;

	@Field(() => Theme)
	theme: Theme;

	@Field(() => [Page])
	pages: Page[];

	@Field()
	isPublished: boolean;

	@Field()
	userId: string;

	@Field(() => User)
	user: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	url: string;

	@Field(() => GraphQLJSONObject)
	themeSettings: Record<string, unknown>;

	@Field(() => CustomDomain, { nullable: true })
	customDomain?: CustomDomain;

	@Field({ nullable: true })
	publishedAt?: Date;

	@Field(() => GraphQLJSONObject, { nullable: true })
	settings?: {
		seo?: {
			title?: string;
			description?: string;
			keywords?: string[];
		};
		analytics?: {
			googleAnalyticsId?: string;
			facebookPixelId?: string;
		};
		social?: {
			facebook?: string;
			twitter?: string;
			instagram?: string;
			linkedin?: string;
		};
	};

	@Field(() => GraphQLJSONObject, { nullable: true })
	analytics?: {
		visits: number;
		uniqueVisitors: number;
		pageViews: number;
		lastUpdated?: Date;
	};
}
