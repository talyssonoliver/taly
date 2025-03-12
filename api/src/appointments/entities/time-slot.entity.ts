import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Salon } from "../../salons/entities/salon.entity";
import { User } from "../../users/entities/user.entity";
@ObjectType()
@ObjectType()
export class TimeSlot {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	salonId: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	staffId: string;
	@Field()
	@Field()
	startTime: Date;
	@Field()
	@Field()
	endTime: Date;
	@Field()
	@Field()
	isAvailable: boolean;
	@Field({ nullable: true })
	@Field({ nullable: true })
	notes: string;
	@Field() => Salon)
	
	@Field(() => Salon)
	salon: Salon;
	@Field() => User, { nullable: true })
	
	@Field(() => User, { nullable: true })
	staff: User;
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


