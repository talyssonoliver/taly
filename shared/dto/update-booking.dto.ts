import {
	IsString,
	IsOptional,
	IsUUID,
	IsEnum,
	IsDateString,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { AppointmentStatus } from "../types/appointment.interface";

/**
 * DTO for updating an existing booking (alias for appointment)
 * This extends the functionality of UpdateAppointmentDto with booking-specific fields
 */
export class UpdateBookingDto {
	@ApiPropertyOptional({
		description: "Staff ID",
		example: "123e4567-e89b-12d3-a456-426614174003",
	})
	@IsUUID()
	@IsOptional()
	staffId?: string;

	@ApiPropertyOptional({
		description: "Booking start time",
		example: "2023-05-15T14:30:00Z",
	})
	@IsDateString()
	@IsOptional()
	startTime?: string;

	@ApiPropertyOptional({
		description: "Booking end time",
		example: "2023-05-15T15:00:00Z",
	})
	@IsDateString()
	@IsOptional()
	endTime?: string;

	@ApiPropertyOptional({
		description: "Booking status",
		enum: AppointmentStatus,
	})
	@IsEnum(AppointmentStatus)
	@IsOptional()
	status?: AppointmentStatus;

	@ApiPropertyOptional({
		description: "Booking notes",
		example: "Client prefers natural products",
	})
	@IsString()
	@IsOptional()
	notes?: string;

	@ApiPropertyOptional({
		description: "Client contact phone number for this booking",
		example: "+1234567890",
	})
	@IsString()
	@IsOptional()
	contactPhone?: string;

	@ApiPropertyOptional({
		description: "Client contact email for this booking",
		example: "client@example.com",
	})
	@IsString()
	@IsOptional()
	contactEmail?: string;

	@ApiPropertyOptional({
		description: "Service ID",
		example: "123e4567-e89b-12d3-a456-426614174002",
	})
	@IsUUID()
	@IsOptional()
	serviceId?: string;
}