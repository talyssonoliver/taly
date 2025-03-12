import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, registerEnumType, Field, ID } from "@nestjs/graphql";
import { Salon } from "./salon.entity";
import { User } from "../../users/entities/user.entity";
import { DayOfWeek } from "./working-hours.entity";
@ObjectType()
@ObjectType()
export class StaffSchedule {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	staffId: string;
	@Field()
	@Field()
	salonId: string;
	@Field()
	@Field()
	dayOfWeek: DayOfWeek;
	@Column({ nullable: true })
	@Field({ nullable: true })
	startTime: string; // Format: 'HH:MM'
	@Column({ nullable: true })
	@Field({ nullable: true })
	endTime: string; // Format: 'HH:MM'
	@Field()
	@Field()
	isUnavailable: boolean;
	@Field() => Salon)
	
	@Field(() => Salon)
	salon: Salon;
	@Field() => User)
	
	@Field(() => User)
	staff: User;
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}

