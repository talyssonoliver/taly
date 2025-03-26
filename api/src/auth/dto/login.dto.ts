import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
	@ApiProperty({
		description: "User email address",
		example: "user@example.com",
	})
	@IsEmail({}, { message: "Please provide a valid email address" })
	@IsNotEmpty({ message: "Email is required" })
	email: string;

	@ApiProperty({
		description: "User password",
		example: "Password123!",
		minLength: 8,
	})
	@IsString()
	@IsNotEmpty({ message: "Password is required" })
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	password: string;
}
