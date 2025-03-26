import { IsString, IsOptional, IsEmail, IsPhoneNumber } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateClientDto {
	@ApiPropertyOptional({
		description: "Client first name",
		example: "John",
	})
	@IsString()
	@IsOptional()
	firstName?: string;

	@ApiPropertyOptional({
		description: "Client last name",
		example: "Doe",
	})
	@IsString()
	@IsOptional()
	lastName?: string;

	@ApiPropertyOptional({
		description: "Client email address",
		example: "john.doe@example.com",
	})
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiPropertyOptional({
		description: "Client phone number",
		example: "+1234567890",
	})
	@IsPhoneNumber(null, { message: "Please provide a valid phone number" })
	@IsOptional()
	phoneNumber?: string;

	@ApiPropertyOptional({
		description: "Additional notes about the client",
		example: "Prefers appointments in the afternoon",
	})
	@IsString()
	@IsOptional()
	notes?: string;

	@ApiPropertyOptional({
		description: "Client profile image URL",
		example: "https://example.com/images/client.jpg",
	})
	@IsString()
	@IsOptional()
	imageClientUrl?: string;
}