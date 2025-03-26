import { IsString, IsOptional, IsEmail, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateSalonDto {
	@ApiPropertyOptional({
		description: "Salon name",
		example: "Elegant Cuts Salon",
	})
	@IsString()
	@IsOptional()
	name?: string;

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

	@ApiPropertyOptional({
		description: "Salon email address",
		example: "info@elegantcuts.com",
	})
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiPropertyOptional({
		description: "Salon website slug for custom domain",
		example: "elegant-cuts",
	})
	@IsString()
	@IsOptional()
	websiteSlug?: string;

	@ApiPropertyOptional({
		description: "Salon active status",
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}