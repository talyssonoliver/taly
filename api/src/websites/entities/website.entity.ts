import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { User } from "../../users/entities/user.entity";
import { Theme } from "./theme.entity";
import { Page } from "./page.entity";
import { CustomDomain } from "./custom-domain.entity";
@ObjectType()
export class Website {
	@Field(() => ID)
	id: string;
	@Field()
	@Index()
	name: string;
	@Field({ nullable: true })
	description?: string;
	@Field()
	themeId: string;
	@Field() => Theme)
	
	theme: Theme; // Join handled by Prisma schema
	@Field() => Page,
		(page) => page.website,
	)
	pages: Page[];
	@Field()
	isPublished: boolean;
	@Field()
	userId: string;
	@Field() => User)
	
	user: User; // Join handled by Prisma schema
	@Field()
	createdAt: Date; // Set in service
	@Field()
	updatedAt: Date; // Set in service
	@Field()
	url: string;
	@Field()
	themeSettings: Record<string, any>;
	@Field() => CustomDomain,
		(customDomain) => customDomain.website,
	)
	customDomain?: CustomDomain;
	@Field({ nullable: true })
	publishedAt?: Date;
	@Field()
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
	@Field()
	analytics?: {
		visits: number;
		uniqueVisitors: number;
		pageViews: number;
		lastUpdated?: Date;
	};
}


