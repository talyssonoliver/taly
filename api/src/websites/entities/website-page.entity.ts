import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { Website } from "./website.entity";
@ObjectType()
@Index(["website", "path"], { unique: true })
export class WebsitePage {
	@Field(() => ID)
	id: string;
	@Field()
	title: string;
	@Field()
	path: string;
	@Field(() => String)
	content: any;
	@Field()
	isPublished: boolean;
	@Field()
	metaTitle: string;
	@Field()
	metaDescription: string;
	@Field()
	sortOrder: number;
	@Field() => Website,
		(website) => website.pages,
		{ onDelete: "CASCADE" },
	)
	
	website: Website; // Join handled by Prisma schema
	@Field()
	websiteId: string;
	@Field()
	createdAt: Date;
	@Field()
	updatedAt: Date;
}


