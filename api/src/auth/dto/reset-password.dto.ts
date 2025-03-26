import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ResetPasswordDto {
	@ApiProperty({
		description: "New password",
		example: "NewPassword123!",
		minLength: 8,
	})
	@IsString()
	@IsNotEmpty({ message: "Password is required" })
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character",
	})
	password: string;

	@ApiProperty({
		description: "Password confirmation",
		example: "NewPassword123!",
	})
	@IsString()
	@IsNotEmpty({ message: "Password confirmation is required" })
	passwordConfirmation: string;
}
