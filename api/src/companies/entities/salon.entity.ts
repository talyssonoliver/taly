import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { Service } from "./service.entity";

@ObjectType()
export class Salon {
	@Field(() => ID)
	id: string;

	@Field()
	name: string;

	@Field({ nullable: true })
	description: string;

	@Field({ nullable: true })
	address: string;

	@Field({ nullable: true })
	city: string;

	@Field({ nullable: true })
	state: string;

	@Field({ nullable: true })
	zipCode: string;

	@Field({ nullable: true })
	country: string;

	@Field({ nullable: true })
	phone: string;

	@Field({ nullable: true })
	email: string;

	@Field({ nullable: true })
	website: string;

	@Field(() => Float, { nullable: true })
	latitude: number;

	@Field(() => Float, { nullable: true })
	longitude: number;

	@Field({ nullable: true })
	coverImage: string;

	@Field({ nullable: true })
	logoImage: string;

	@Field(() => [String], { nullable: true })
	images: string[];

	@Field()
	isActive: boolean;

	@Field()
	ownerId: string;

	@Field(() => User)
	owner: User;

	@Field(() => [Service], { nullable: true })
	services: Service[];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
