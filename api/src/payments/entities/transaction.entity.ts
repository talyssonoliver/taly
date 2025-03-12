import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { Payment } from "./payment.entity";
import { User } from "../../users/entities/user.entity";
export enum TransactionType {
	PAYMENT = "PAYMENT",
	REFUND = "REFUND",
	CHARGEBACK = "CHARGEBACK",
}
export enum TransactionStatus {
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
	PENDING = "PENDING",
}
@ObjectType()
@ObjectType()
export class Transaction {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	paymentId: string;
	@Field()
	@Field()
	userId: string;
	@Field(() => Float)
	@Field(() => Float)
	amount: number;
	@Field()
	@Field()
	type: TransactionType;
	@Field()
	@Field()
	status: TransactionStatus;
	@Field({ nullable: true })
	@Field({ nullable: true })
	providerTransactionId: string;
	@Field(() => String)
	@Field(() => String, { nullable: true })
	providerResponse: string;
	@Field() => Payment,
		(payment) => payment.transactions,
	)
	
	@Field(() => Payment)
	payment: Payment;
	@Field() => User)
	
	@Field(() => User)
	user: User;
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


