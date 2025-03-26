import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
	@ApiProperty({
		description: "User email address",
		example: "user@example.com",
	})
	@IsEmail({}, { message: "Please provide a valid email address" })
	@IsNotEmpty({ message: "Email is required" })
	email: string;
}