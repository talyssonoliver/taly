import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Client } from "./client.entity";
import { User } from "../../users/entities/user.entity";
export enum NoteType {
	GENERAL = "GENERAL",
	APPOINTMENT = "APPOINTMENT",
	MEDICAL = "MEDICAL",
	PREFERENCE = "PREFERENCE",
	FEEDBACK = "FEEDBACK",
}
@ObjectType()
@ObjectType()
export class ClientNote {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	clientId: string;
	@Field()
	@Field()
	createdById: string;
	@Field()
	@Field()
	content: string;
	@Field()
	@Field()
	type: NoteType;
	@Field()
	@Field()
	isPrivate: boolean;
	@Field() => Client,
		(client) => client.notes,
	)
	
	@Field(() => Client)
	client: Client;
	@Field() => User)
	
	@Field(() => User)
	createdBy: User;
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


