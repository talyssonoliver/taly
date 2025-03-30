import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Salon } from "../../companies/entities/salon.entity";
import { User } from "../../users/entities/user.entity";
import { ClientNote } from "./client-note.entity";

export enum Gender {
	MALE = "MALE",
	FEMALE = "FEMALE",
	OTHER = "OTHER",
}

@ObjectType()
export class Client {
	@Field(() => ID)
	id: string;

	@Field()
	salonId: string;

	@Field({ nullable: true })
	userId: string;

	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	email: string;

	@Field({ nullable: true })
	phone: string;

	@Field({ nullable: true })
	address: string;

	@Field({ nullable: true })
	city: string;

	@Field({ nullable: true })
	state: string;

	@Field({ nullable: true })
	zipCode: string;

	@Field({ nullable: true })
	birthdate: Date;

	@Field({ nullable: true })
	gender: Gender;

	@Field({ nullable: true })
	referralSource: string;

	@Field(() => [String], { nullable: true })
	tags: string[];

	@Field({ nullable: true })
	notes: string;

	@Field(() => String, { nullable: true })
	preferences: Record<string, unknown>;

	@Field(() => String, { nullable: true })
	medicalInfo: Record<string, unknown>;

	@Field(() => Salon)
	salon: Salon;

	@Field(() => User, { nullable: true })
	user: User;

	@Field(() => [ClientNote], { nullable: true })
	clientNotes: ClientNote[];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	get fullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}
}
