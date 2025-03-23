import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Float, Int } from "@nestjs/graphql";
import { Salon } from "./salon.entity";
@ObjectType()
@ObjectType()
export class Service {
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
	@Field(() => Float)
	price: number;
	@Field()
	@Field(() => Int)
	duration: number; // in minutes
	@Field({ nullable: true })
	@Field({ nullable: true })
	image: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	category: string;
	@Field()
	@Field()
	isActive: boolean;
	@Field()
	@Field()
	salonId: string;
	@Field() => Salon,
		(salon) => salon.services,
	)
	
	@Field(() => Salon)
	salon: Salon;
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


