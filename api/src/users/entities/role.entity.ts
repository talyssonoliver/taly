import { ObjectType, Field, ID } from "@nestjs/graphql";
import {
	IsString,
	IsOptional,
	IsUUID,
	IsDate,
	IsNotEmpty,
	ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { User } from "./user.entity";

@ObjectType()
export class Staff {
	@Field(() => ID)
	@IsUUID()
	id: string;

	@Field()
	@IsUUID()
	@IsNotEmpty()
	userId: string;

	@Field(() => String, { description: "JSON string of permissions" })
	@IsNotEmpty()
	permissions: Record<string, boolean>;

	@Field({
		nullable: true,
		description: "Department the staff member belongs to",
	})
	@IsOptional()
	@IsString()
	department?: string;

	@Field({ nullable: true, description: "Job position or title" })
	@IsOptional()
	@IsString()
	position?: string;

	@Field({
		nullable: true,
		description: "Company-specific employee identifier",
	})
	@IsOptional()
	@IsString()
	employeeId?: string;

	@Field({ nullable: true, description: "Date when staff member was hired" })
	@IsOptional()
	@IsDate()
	hireDate?: Date;

	@Field()
	@IsDate()
	createdAt: Date;

	@Field()
	@IsDate()
	updatedAt: Date;

	@Field(() => User)
	@ValidateNested()
	@Type(() => User)
	user: User;
}