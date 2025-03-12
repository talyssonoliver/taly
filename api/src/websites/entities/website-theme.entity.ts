import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
export enum WebsiteThemeCategory {
	BUSINESS = "business",
	PORTFOLIO = "portfolio",
	BLOG = "blog",
	ECOMMERCE = "ecommerce",
	LANDING = "landing",
	PERSONAL = "personal",
}
@ObjectType()
export class WebsiteTheme {
	@Field(() => ID)
	id: string;
	@Field()
	name: string;
	@Field()
	description: string;
	@Field({ nullable: true })
	thumbnail: string;
	@Field()
	category: WebsiteThemeCategory;
	@Field()
	isActive: boolean;
	@Field()
	settings: {
		defaultColors?: {
			primary?: string;
			secondary?: string;
			accent?: string;
			background?: string;
			text?: string;
		};
		defaultFonts?: {
			heading?: string;
			body?: string;
		};
		layoutOptions?: string[];
		availableComponents?: string[];
		[key: string]: any;
	};
	@Field()
	templates: {
		home?: string;
		about?: string;
		contact?: string;
		blog?: string;
		blogPost?: string;
		[key: string]: string;
	};
	@Field()
	defaultCss: string;
	@Field()
	defaultJs: string;
	@Field()
	version: number;
	@Field()
	authorName: string;
	@Field()
	createdAt: Date;
	@Field()
	updatedAt: Date;
}


