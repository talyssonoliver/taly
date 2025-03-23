import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, registerEnumType, Field, ID } from "@nestjs/graphql";
import { Salon } from "./salon.entity";
export enum DayOfWeek {
	MONDAY = "MONDAY",
	TUESDAY = "TUESDAY",
	WEDNESDAY = "WEDNESDAY",
	THURSDAY = "THURSDAY",
	FRIDAY = "FRIDAY",
	SATURDAY = "SATURDAY",
	SUNDAY = "SUNDAY",
}
@ObjectType()
@ObjectType()
export class WorkingHours {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	dayOfWeek: DayOfWeek;
	@Field({ nullable: true })
	@Field({ nullable: true })
	openTime: string; // Format: 'HH:MM'
	@Field({ nullable: true })
	@Field({ nullable: true })
	closeTime: string; // Format: 'HH:MM'
	@Field()
	@Field()
	isClosed: boolean;
	@Field()
	@Field()
	salonId: string;
	@Field() => Salon,
		(salon) => salon.workingHours,
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


