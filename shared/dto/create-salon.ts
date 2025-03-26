import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsEmail,
	IsUUID,
	IsBoolean,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSalonDto {
	@ApiProperty({
		description: "Salon owner ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Owner ID is required" })
	ownerId: string;

	@ApiProperty({
		description: "Salon name",
		example: "Elegant Cuts",
	})
	@IsString()
	@IsNotEmpty({ message: "Salon name is required" })
	name: string;

	@ApiPropertyOptional({
		description: "Salon description",
		example: "A premium hair salon offering top-notch services",
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiPropertyOptional({
		description: "Salon logo URL",
		example: "https://example.com/images/logo.png",
	})
	@IsString()
	@IsOptional()
	logoUrl?: string;

	@ApiPropertyOptional({
		description: "Salon address",
		example: "123 Main St, City",
	})
	@IsString()
	@IsOptional()
	address?: string;

	@ApiPropertyOptional({
		description: "Salon post code",
		example: "10001",
	})
	@IsString()
	@IsOptional()
	postCode?: string;

	@ApiPropertyOptional({
		description: "Salon phone number",
		example: "+1234567890",
	})
	@IsString()
	@IsOptional()
	phoneNumber?: string;

	@ApiProperty({
		description: "Salon email address",
		example: "info@elegantcuts.com",
	})
	@IsEmail()
	@IsNotEmpty({ message: "Email is required" })
	email: string;

	@ApiPropertyOptional({
		description: "Salon website slug for custom domain",
		example: "elegant-cuts",
	})
	@IsString()
	@IsOptional()
	websiteSlug?: string;

	@ApiPropertyOptional({
		description: "Salon active status",
		default: true,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}