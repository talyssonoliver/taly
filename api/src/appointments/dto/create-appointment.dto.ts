import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";

@InputType()
export class CreateAppointmentDto {
	@Field()
	@ApiProperty({
		description: "Salon ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsNotEmpty()
	@IsUUID()
	salonId: string;

	@Field()
	@ApiProperty({
		description: "Service ID",
		example: "123e4567-e89b-12d3-a456-426614174001",
	})
	@IsNotEmpty()
	@IsUUID()
	serviceId: string;

	@Field()
	@ApiProperty({
		description: "Appointment start time",
		example: "2023-05-15T14:30:00Z",
	})
	@IsNotEmpty()
	@IsDateString()
	startTime: string;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Staff member ID",
		example: "123e4567-e89b-12d3-a456-426614174002",
	})
	@IsOptional()
	@IsUUID()
	staffId?: string;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Appointment notes",
		example: "Please use hypoallergenic products",
	})
	@IsOptional()
	@IsString()
	notes?: string;
}
