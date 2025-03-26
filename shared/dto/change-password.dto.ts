import { IsNotEmpty, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Match } from "../decorators/match.decorator";

export class ChangePasswordDto {
	@ApiProperty({
		description: "Current password",
		example: "CurrentPassword123!",
	})
	@IsNotEmpty({ message: "Current password is required" })
	currentPassword: string;

	@ApiProperty({
		description: "New password",
		example: "NewPassword123!",
		minLength: 8,
	})
	@IsNotEmpty({ message: "New password is required" })
	@MinLength(8, { message: "New password must be at least 8 characters long" })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character",
	})
	newPassword: string;

	@ApiProperty({
		description: "Confirm new password",
		example: "NewPassword123!",
	})
	@IsNotEmpty({ message: "Password confirmation is required" })
	@Match("newPassword", { message: "Passwords do not match" })
	confirmPassword: string;
}