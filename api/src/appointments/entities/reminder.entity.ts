import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Appointment } from "./appointment.entity";

export enum ReminderType {
	EMAIL = "EMAIL",
	SMS = "SMS",
	PUSH = "PUSH",
}

@ObjectType()
export class Reminder {
	@Field(() => ID)
	id: string;

	@Field()
	appointmentId: string;

	@Field()
	reminderTime: Date;

	@Field()
	sent: boolean;

	@Field({ nullable: true })
	sentAt?: Date;

	@Field()
	type: ReminderType;

	@Field(() => Appointment)
	appointment: Appointment;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
