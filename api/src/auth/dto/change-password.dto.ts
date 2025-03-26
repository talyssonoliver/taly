import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {
	@ApiProperty({
		description: "Current password",
		example: "CurrentPassword123!",
	})
	@IsString()
	@IsNotEmpty({ message: "Current password is required" })
	currentPassword: string;

	@ApiProperty({
		description: "New password",
		example: "NewPassword123!",
		minLength: 8,
	})
	@IsString()
	@IsNotEmpty({ message: "New password is required" })
	@MinLength(8, { message: "New password must be at least 8 characters long" })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character",
	})
	newPassword: string;
}
