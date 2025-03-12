import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { Service } from "./service.entity";
import { WorkingHours } from "./working-hours.entity";
@ObjectType()
@ObjectType()
export class Salon {
	@Field(() => ID)
	@Field(() => ID)
	id: string;
	@Field()
	@Field()
	name: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	description: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	address: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	city: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	state: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	zipCode: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	country: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	phone: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	email: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	website: string;
	@Field(() => Float)
	@Field({ nullable: true })
	latitude: number;
	@Field(() => Float)
	@Field({ nullable: true })
	longitude: number;
	@Field({ nullable: true })
	@Field({ nullable: true })
	coverImage: string;
	@Field({ nullable: true })
	@Field({ nullable: true })
	logoImage: string;
	@Field(() => [String])
	@Field(() => [String], { nullable: true })
	images: string[];
	@Field()
	@Field()
	isActive: boolean;
	@Field()
	@Field()
	ownerId: string;
	@Field() => User)
	
	@Field(() => User)
	owner: User;
	@Field() => Service,
		(service) => service.salon,
	)
	@Field(() => [Service], { nullable: true })
	services: Service[];
	@Field() => WorkingHours,
		(workingHours) => workingHours.salon,
	)
	@Field(() => [WorkingHours], { nullable: true })
	workingHours: WorkingHours[];
	@Field()
	@Field()
	createdAt: Date;
	@Field()
	@Field()
	updatedAt: Date;
}


