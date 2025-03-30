import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";

export class CreateStaffDto {
	@ApiProperty({
		description: "Staff member name",
		example: "John Smith",
	})
	@IsString()
	@IsNotEmpty({ message: "Name is required" })
	name: string;

	@ApiProperty({
		description: "Staff member email address",
		example: "john.smith@example.com",
	})
	@IsEmail({}, { message: "Please provide a valid email address" })
	email: string;

	@ApiPropertyOptional({
		description: "Staff member phone number",
		example: "+44 7700 900000",
	})
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiPropertyOptional({
		description: "IDs of services the staff member can provide",
		example: ["123e4567-e89b-12d3-a456-426614174000"],
	})
	@IsOptional()
	@IsArray()
	@IsUUID("4", { each: true })
	serviceIds?: string[];

	@ApiProperty({
		description: "User ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "User ID is required" })
	userId: string;

	@ApiProperty({
		description: "Salon ID",
		example: "123e4567-e89b-12d3-a456-426614174001",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Salon ID is required" })
	salonId: string;

	@ApiPropertyOptional({
		description: "Staff bio or description",
		example: "Experienced stylist with 5 years in the industry.",
	})
	@IsString()
	@IsOptional()
	bio?: string;

	@ApiPropertyOptional({
		description: "Staff position or title",
		example: "Senior Stylist",
	})
	@IsString()
	@IsOptional()
	position?: string;

	@ApiPropertyOptional({
		description: "Staff active status",
		default: true,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}

