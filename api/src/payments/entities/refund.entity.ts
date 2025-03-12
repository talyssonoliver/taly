import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { Payment } from "./payment.entity";
import { User } from "../../users/entities/user.entity";
@ObjectType()
@ObjectType()
export class Refund {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	paymentId: string;
	@Field(() => Float)
	@Field(() => Float)
	amount: number;
	@Field({ nullable: true })
	@Field({ nullable: true })
	reason: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	transactionId: string;
	@Field()
	@Field()
	refundedBy: string;
	@Field() => Payment,
		(payment) => payment.refunds,
	)
	
	@Field(() => Payment)
	payment: Payment;
	@Field() => User)
	
	@Field(() => User)
	refundedByUser: User;
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


