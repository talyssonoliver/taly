import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { Appointment } from "../../appointments/entities/appointment.entity";
import { Transaction } from "./transaction.entity";
import { Refund } from "./refund.entity";
import { PaymentStatus } from "../../common/enums/payment-status.enum";
export enum PaymentProvider {
	STRIPE = "STRIPE",
	PAYPAL = "PAYPAL",
	CASH = "CASH",
}
@ObjectType()
@ObjectType()
export class Payment {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	userId: string;
	@Field()
	@Field()
	appointmentId: string;
	@Field(() => Float)
	@Field(() => Float)
	amount: number;
	@Field()
	@Field()
	status: PaymentStatus;
	@Field()
	@Field()
	provider: PaymentProvider;
	@Field({ nullable: true })
	@Field({ nullable: true })
	paymentMethod: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	transactionId: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	description: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	processedAt: Date;
	@Field(() => Float)
	@Field(() => Float, { nullable: true })
	refundedAmount: number;
	@Field({ nullable: true })
	@Field({ nullable: true })
	refundedAt: Date;
	@Field({ nullable: true })
	@Field({ nullable: true })
	errorMessage: string;
	@Field() => User)
	
	@Field(() => User)
	user: User;
	@Field() => Appointment)
	
	@Field(() => Appointment)
	appointment: Appointment;
	@Field() => Transaction,
		(transaction) => transaction.payment,
	)
	@Field(() => [Transaction], { nullable: true })
	transactions: Transaction[];
	@Field() => Refund,
		(refund) => refund.payment,
	)
	@Field(() => [Refund], { nullable: true })
	refunds: Refund[];
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


