import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, registerEnumType, Field, ID } from "@nestjs/graphql";
import { Feature } from "./feature.entity";
import { BillingPeriod } from "../constants/subscription.constants";
@ObjectType()
@ObjectType()
export class Plan {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	name: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	description: string;
	@Field(() => Float)
	@Field()
	price: number;
	@Field()
	@Field()
	currency: string;
	@Field()
	@Field()
	billingPeriod: BillingPeriod;
	@Field()
	@Field()
	isActive: boolean;
	@Field()
	@Field()
	isPublic: boolean;
	@Field()
	@Field()
	trialDays: number;
	@Field({ nullable: true })
	@Field({ nullable: true })
	tier: number;
	@Field() => Feature,
		(feature) => feature.plan,
		{ eager: true, cascade: true },
	)
	@Field(() => [Feature])
	features: Feature[];
	@Field()
	@Field({ nullable: true })
	metadata: Record<string, any>;
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


