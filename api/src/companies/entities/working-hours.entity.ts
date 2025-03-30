import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Salon } from "./salon.entity";

export enum DayOfWeek {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 0,
}

registerEnumType(DayOfWeek, {
	name: "DayOfWeek",
	description: "The day of the week (0-6, where 0 is Sunday)",
});

@ObjectType()
export class WorkingHours {
	@Field(() => ID)
	id: string;

	@Field(() => DayOfWeek)
	dayOfWeek: DayOfWeek;

	@Field(() => String, { nullable: true })
	openTime: string; // Format: 'HH:MM'

	@Field(() => String, { nullable: true })
	closeTime: string; // Format: 'HH:MM'

	@Field(() => Boolean)
	isClosed: boolean;

	@Field(() => String)
	salonId: string;

	@Field(() => Salon)
	salon: Salon;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	constructor(salon?: Salon) {
		if (salon) {
			this.salonId = salon.id;
		}
	}
}
