import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEmail,
	IsOptional,
	IsString,
	Matches,
	MinLength,
} from "class-validator";

export class RegisterDto {
	@ApiProperty({
		description: "User email address",
		example: "user@example.com",
	})
	@IsEmail({}, { message: "Please provide a valid email address" })
	email: string;

	@ApiProperty({
		description: "User password",
		example: "Password123!",
		minLength: 8,
	})
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character",
	})
	password: string;

	@ApiProperty({
		description: "User first name",
		example: "John",
	})
	@IsString({ message: "First name must be a string" })
	firstName: string;

	@ApiPropertyOptional({
		description: "User last name",
		example: "Doe",
	})
	@IsString({ message: "Last name must be a string" })
	@IsOptional()
	lastName?: string;

	@ApiProperty({
		description: "Full name",
		example: "John Doe",
	})
	@IsString()
	name: string;

	@ApiPropertyOptional({
		description: "Business name",
		example: "Acme Inc.",
	})
	@IsOptional()
	@IsString()
	businessName?: string;
}
