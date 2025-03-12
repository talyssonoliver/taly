import { ObjectType, Field, ID, registerEnumType } from "@nestjs/graphql";
import {
	IsEmail,
	IsOptional,
	IsString,
	IsBoolean,
	IsDate,
	IsEnum,
	Length,
	Matches,
} from "class-validator";
import { Role } from "../../common/enums/roles.enum";
import { Staff } from "./staff.entity";

// Register Role enum for GraphQL schema
registerEnumType(Role, {
	name: "Role",
});

@ObjectType()
export class User {
	@Field(() => ID)
	id: string;

	@Field()
	@IsEmail({}, { message: "Invalid email format" })
	email: string;

	// Password is not exposed in GraphQL schema but should be validated in DTO
	@IsString()
	@Length(8, 100)
	password?: string;

	@Field({ nullable: true, description: "User's first name" })
	@IsOptional()
	@IsString()
	@Length(1, 50)
	firstName?: string;

	@Field({ nullable: true, description: "User's last name" })
	@IsOptional()
	@IsString()
	@Length(1, 50)
	lastName?: string;

	@Field(() => Role)
	@IsEnum(Role)
	role: Role;

	@Field()
	@IsBoolean()
	isActive: boolean;

	@Field({ nullable: true, description: "URL to user's avatar image" })
	@IsOptional()
	@IsString()
	avatar?: string;

	@Field({ nullable: true, description: "User's contact phone number" })
	@IsOptional()
	@IsString()
	@Matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, {
		message: "Phone must be a valid phone number",
	})
	phone?: string;

	@Field({ nullable: true, description: "User's physical address" })
	@IsOptional()
	@IsString()
	address?: string;

	@Field({
		nullable: true,
		description: "OAuth provider (e.g., Google, Facebook)",
	})
	@IsOptional()
	@IsString()
	provider?: string;

	@Field({ nullable: true, description: "ID from OAuth provider" })
	@IsOptional()
	@IsString()
	providerId?: string;

	@Field()
	@IsDate()
	createdAt: Date;

	@Field()
	@IsDate()
	updatedAt: Date;

	@Field(() => Staff, {
		nullable: true,
		description: "Staff information if user is an employee",
	})
	staff?: Staff;
}