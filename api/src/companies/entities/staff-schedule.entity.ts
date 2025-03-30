import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { Salon } from "./salon.entity";
import { DayOfWeek } from "./working-hours.entity";

@ObjectType()
export class StaffSchedule {
	@Field(() => ID)
	id: string;

	@Field()
	staffId: string;

	@Field()
	salonId: string;

	@Field()
	dayOfWeek: DayOfWeek;

	@Field({ nullable: true })
	startTime: string; // Format: 'HH:MM'

	@Field({ nullable: true })
	endTime: string; // Format: 'HH:MM'

	@Field()
	isUnavailable: boolean;

	@Field(() => Salon)
	salon: Salon;

	@Field(() => User)
	staff: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
