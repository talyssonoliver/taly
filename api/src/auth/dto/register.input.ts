import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";

export class RegisterInput {
	@ApiProperty({ description: "User's email address" })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description:
			"User's password (min 8 chars, requires uppercase, lowercase, number)",
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(100)
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/, {
		message:
			"Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
	})
	password: string;

	@ApiProperty({ description: "User's first name" })
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({ description: "User's last name" })
	@IsString()
	@IsNotEmpty()
	lastName: string;

	@ApiPropertyOptional({ description: "User's phone number" })
	@IsString()
	@IsOptional()
	phoneNumber?: string;

	@ApiPropertyOptional({
		description: "The salon ID if the user belongs to a salon",
	})
	@IsString()
	@IsOptional()
	salonId?: string;
}
