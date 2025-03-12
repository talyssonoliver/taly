import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Appointment } from "./appointment.entity";
export enum ReminderType {
	EMAIL = "EMAIL",
	SMS = "SMS",
	PUSH = "PUSH",
}
@ObjectType()
@ObjectType()
export class Reminder {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	appointmentId: string;
	@Field()
	@Field()
	reminderTime: Date;
	@Field()
	@Field()
	sent: boolean;
	@Field({ nullable: true })
	@Field({ nullable: true })
	sentAt: Date;
	@Field()
	@Field()
	type: ReminderType;
	@Field() => Appointment,
		(appointment) => appointment.reminders,
	)
	
	@Field(() => Appointment)
	appointment: Appointment;
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


