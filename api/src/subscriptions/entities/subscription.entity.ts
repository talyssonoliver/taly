import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, registerEnumType, Field, ID } from "@nestjs/graphql";
import { Plan } from "./plan.entity";
import {
	SubscriptionStatus,
	BillingPeriod,
} from "../constants/subscription.constants";
@ObjectType()
@ObjectType()
export class Subscription {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	userId: string;
	@Field() => Plan, { eager: true })
	
	@Field(() => Plan)
	plan: Plan;
	@Field()
	@Field()
	status: SubscriptionStatus;
	@Field()
	@Field()
	startDate: Date;
	@Field()
	@Field({ nullable: true })
	endDate: Date;
	@Field()
	@Field({ nullable: true })
	renewalDate: Date;
	@Field()
	@Field({ nullable: true })
	cancelledAt: Date;
	@Field()
	@Field()
	isAutoRenew: boolean;
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
	@Field({ nullable: true })
	paymentMethodId: string;
	@Field()
	@Field({ nullable: true })
	nextInvoiceId: string;
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


