import { IsNotEmpty, MinLength, Matches, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Match } from "../decorators/match.decorator";

export class ResetPasswordDto {
	@ApiProperty({
		description: "Reset token",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsString()
	@IsNotEmpty({ message: "Token is required" })
	token: string;

	@ApiProperty({
		description: "New password",
		example: "NewPassword123!",
		minLength: 8,
	})
	@IsNotEmpty({ message: "Password is required" })
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character",
	})
	password: string;

	@ApiProperty({
		description: "Confirm new password",
		example: "NewPassword123!",
	})
	@IsNotEmpty({ message: "Password confirmation is required" })
	@Match("password", { message: "Passwords do not match" })
	confirmPassword: string;
}