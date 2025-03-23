import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Salon } from "../../companies/entities/salon.entity";
import { User } from "../../users/entities/user.entity";

@ObjectType()
export class TimeSlot {
	@Field(() => ID)
	id: string;

	@Field()
	salonId: string;

	@Field({ nullable: true })
	staffId: string;

	@Field()
	startTime: Date;

	@Field()
	endTime: Date;

	@Field()
	isAvailable: boolean;

	@Field({ nullable: true })
	notes: string;

	@Field(() => Salon)
	salon: Salon;

	@Field(() => User, { nullable: true })
	staff: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
