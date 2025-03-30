import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUUID,
} from "class-validator";

export class CreateClientInput {
	@ApiProperty({ description: "The first name of the client" })
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({ description: "The last name of the client" })
	@IsString()
	@IsNotEmpty()
	lastName: string;

	@ApiPropertyOptional({ description: "The email address of the client" })
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiPropertyOptional({ description: "The phone number of the client" })
	@IsPhoneNumber(null)
	@IsOptional()
	phoneNumber?: string;

	@ApiProperty({ description: "The salon ID the client belongs to" })
	@IsUUID()
	@IsNotEmpty()
	salonId: string;
}
