import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";

export class RegisterDto {
	@ApiProperty({
		description: "User email address",
		example: "user@example.com",
	})
	@IsEmail({}, { message: "Please provide a valid email address" })
	@IsNotEmpty({ message: "Email is required" })
	email: string;

	@ApiProperty({
		description:
			"User password - must be at least 8 characters with at least one number and one special character",
		example: "Password123!",
	})
	@IsString({ message: "Password must be a string" })
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
		message:
			"Password must contain at least one number and one special character",
	})
	password: string;

	@ApiProperty({
		description: "User first name",
		example: "John",
	})
	@IsString({ message: "First name must be a string" })
	@IsNotEmpty({ message: "First name is required" })
	@MaxLength(50, { message: "First name cannot exceed 50 characters" })
	firstName: string;

	@ApiProperty({
		description: "User last name",
		example: "Doe",
	})
	@IsString({ message: "Last name must be a string" })
	@IsNotEmpty({ message: "Last name is required" })
	@MaxLength(50, { message: "Last name cannot exceed 50 characters" })
	lastName: string;
}
