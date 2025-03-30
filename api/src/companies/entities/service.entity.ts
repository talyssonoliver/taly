import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { Salon } from "./salon.entity";

@ObjectType()
export class Service {
	@Field(() => ID)
	id: string;

	@Field()
	name: string;

	@Field({ nullable: true })
	description: string;

	@Field(() => Float)
	price: number;

	@Field(() => Int)
	duration: number; // in minutes

	@Field({ nullable: true })
	image: string;

	@Field({ nullable: true })
	category: string;

	@Field()
	isActive: boolean;

	@Field()
	salonId: string;

	@Field(() => Salon)
	salon: Salon;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
