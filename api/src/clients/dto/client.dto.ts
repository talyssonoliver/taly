import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Client } from "@prisma/client";
import {
	IsDate,
	IsEmail,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUUID,
} from "class-validator";

export class ClientDto {
	@ApiProperty({ description: "The unique identifier of the client" })
	@IsUUID()
	id: string;

	@ApiProperty({ description: "The first name of the client" })
	@IsString()
	firstName: string;

	@ApiProperty({ description: "The last name of the client" })
	@IsString()
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
	salonId: string;

	@ApiProperty({ description: "When the client was created" })
	@IsDate()
	createdAt: Date;

	@ApiProperty({ description: "When the client was last updated" })
	@IsDate()
	updatedAt: Date;

	constructor(client: Client) {
		this.id = client.id;
		this.firstName = client.firstName;
		this.lastName = client.lastName;
		this.email = client.email;
		this.phoneNumber = client.phoneNumber;
		this.salonId = client.salonId;
		this.createdAt = client.createdAt;
		this.updatedAt = client.updatedAt;
	}
}
