import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { Client } from "./client.entity";

export enum NoteType {
	GENERAL = "GENERAL",
	APPOINTMENT = "APPOINTMENT",
	MEDICAL = "MEDICAL",
	PREFERENCE = "PREFERENCE",
	FEEDBACK = "FEEDBACK",
}

@ObjectType()
export class ClientNote {
	@Field(() => ID)
	id: string;

	@Field()
	clientId: string;

	@Field()
	createdById: string;

	@Field()
	content: string;

	@Field()
	type: NoteType;

	@Field()
	isPrivate: boolean;

	@Field(() => Client)
	client: Client;

	@Field(() => User)
	createdBy: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
