import {
	IsOptional,
	IsString,
	MinLength,
	Matches,
	IsBoolean,
	IsEnum,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "../types/user.interface";

export class UpdateUserDto {
	@ApiPropertyOptional({
		description: "User first name",
		example: "John",
	})
	@IsString({ message: "First name must be a string" })
	@IsOptional()
	firstName?: string;

	@ApiPropertyOptional({
		description: "User last name",
		example: "Doe",
	})
	@IsString({ message: "Last name must be a string" })
	@IsOptional()
	lastName?: string;

	@ApiPropertyOptional({
		description: "User password",
		example: "NewPassword123!",
		minLength: 8,
	})
	@IsOptional()
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character",
	})
	password?: string;

	@ApiPropertyOptional({
		description: "User role",
		enum: UserRole,
	})
	@IsEnum(UserRole, { message: "Invalid role" })
	@IsOptional()
	role?: UserRole;

	@ApiPropertyOptional({
		description: "User active status",
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;

	@ApiPropertyOptional({
		description: "User profile image URL",
		example: "https://example.com/images/profile.jpg",
	})
	@IsString()
	@IsOptional()
	profileImage?: string;

	@ApiPropertyOptional({
		description: "User phone number",
		example: "+1234567890",
	})
	@IsString()
	@IsOptional()
	phoneNumber?: string;
}