import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
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


