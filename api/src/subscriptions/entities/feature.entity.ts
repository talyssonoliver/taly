import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Plan } from "./plan.entity";
@ObjectType()
@ObjectType()
export class Feature {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	name: string;
	@Field(() => String)
	@Field()
	value: any;
	@Field({ nullable: true })
	@Field({ nullable: true })
	description: string;
	@Field()
	@Field({ nullable: true })
	featureCode: string;
	@Field() => Plan,
		(plan) => plan.features,
	)
	
	plan: Plan; // Join handled by Prisma schema
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


