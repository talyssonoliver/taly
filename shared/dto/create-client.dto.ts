import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsEmail,
	IsUUID,
	IsPhoneNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateClientDto {
	@ApiProperty({
		description: "Salon ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Salon ID is required" })
	salonId: string;

	@ApiProperty({
		description: "Client first name",
		example: "John",
	})
	@IsString()
	@IsNotEmpty({ message: "First name is required" })
	firstName: string;

	@ApiProperty({
		description: "Client last name",
		example: "Doe",
	})
	@IsString()
	@IsNotEmpty({ message: "Last name is required" })
	lastName: string;

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