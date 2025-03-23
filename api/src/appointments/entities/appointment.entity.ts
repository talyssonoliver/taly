import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { AppointmentStatus } from "../../common/enums/appointment-status.enum";
import { Salon } from "../../companies/entities/salon.entity";
import { Service } from "../../companies/entities/service.entity";
import { User } from "../../users/entities/user.entity";
import { Reminder } from "./reminder.entity";

@ObjectType()
export class Appointment {
	@Field(() => ID)
	id: string;

	@Field()
	userId: string;

	@Field()
	salonId: string;

	@Field()
	serviceId: string;

	@Field({ nullable: true })
	staffId?: string;

	@Field()
	startTime: Date;

	@Field()
	endTime: Date;

	@Field()
	status: AppointmentStatus;

	@Field(() => Float)
	price: number;

	@Field({ nullable: true })
	notes?: string;

	@Field({ nullable: true })
	cancellationReason?: string;

	@Field(() => Float, { nullable: true })
	cancellationFee?: number;

	@Field(() => Float, { nullable: true })
	noShowFee?: number;

	@Field(() => User)
	user: User;

	@Field(() => Salon)
	salon: Salon;

	@Field(() => Service)
	service: Service;

	@Field(() => User, { nullable: true })
	staff?: User;

	@Field(() => [Reminder], { nullable: true })
	reminders?: Reminder[];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
