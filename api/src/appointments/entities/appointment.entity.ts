import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { Salon } from "../../salons/entities/salon.entity";
import { Service } from "../../salons/entities/service.entity";
import { Reminder } from "./reminder.entity";
import { AppointmentStatus } from "../../common/enums/appointment-status.enum";
@ObjectType()
@ObjectType()
export class Appointment {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	userId: string;
	@Field()
	@Field()
	salonId: string;
	@Field()
	@Field()
	serviceId: string;
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
	status: AppointmentStatus;
	@Field(() => Float)
	@Field(() => Float)
	price: number;
	@Field({ nullable: true })
	@Field({ nullable: true })
	notes: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	cancellationReason: string;
	@Field(() => Float)
	@Field(() => Float, { nullable: true })
	cancellationFee: number;
	@Field(() => Float)
	@Field(() => Float, { nullable: true })
	noShowFee: number;
	@Field() => User)
	
	@Field(() => User)
	user: User;
	@Field() => Salon)
	
	@Field(() => Salon)
	salon: Salon;
	@Field() => Service)
	
	@Field(() => Service)
	service: Service;
	@Field() => User, { nullable: true })
	
	@Field(() => User, { nullable: true })
	staff: User;
	@Field() => Reminder,
		(reminder) => reminder.appointment,
	)
	@Field(() => [Reminder], { nullable: true })
	reminders: Reminder[];
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


