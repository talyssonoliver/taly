import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { PaymentProvider } from "./payment.entity";
export enum PaymentMethodType {
	CARD = "CARD",
	BANK_ACCOUNT = "BANK_ACCOUNT",
	PAYPAL = "PAYPAL",
}
@ObjectType()
@ObjectType()
export class PaymentMethod {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	userId: string;
	@Field()
	@Field()
	type: PaymentMethodType;
	@Field()
	@Field()
	provider: PaymentProvider;
	@Field()
	@Field()
	token: string;
	@Field()
	@Field()
	isDefault: boolean;
	@Field({ nullable: true })
	@Field({ nullable: true })
	lastFour: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	expiryMonth: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	expiryYear: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	cardBrand: string;
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


