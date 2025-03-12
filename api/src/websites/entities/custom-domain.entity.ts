import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { Website } from "./website.entity";
@ObjectType()
export class CustomDomain {
	@Field(() => ID)
	id: string;
	@Field()
	websiteId: string;
	@Field() => Website,
		(website) => website.customDomain,
	)
	
	website: Website;
	@Field()
	@Index({ unique: true })
	domain: string;
	@Field()
	status: "pending" | "active" | "failed" | "verifying";
	@Field()
	sslEnabled: boolean;
	@Field()
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


