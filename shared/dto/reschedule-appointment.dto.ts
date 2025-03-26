import { IsNotEmpty, IsDateString, IsOptional, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RescheduleAppointmentDto {
	@ApiProperty({
		description: "New appointment start time",
		example: "2023-05-16T15:30:00Z",
	})
	@IsDateString()
	@IsNotEmpty({ message: "Start time is required" })
	startTime: string;

	@ApiProperty({
		description: "New appointment end time",
		example: "2023-05-16T16:00:00Z",
	})
	@IsDateString()
	@IsNotEmpty({ message: "End time is required" })
	endTime: string;

	@ApiPropertyOptional({
		description: "New staff ID",
		example: "123e4567-e89b-12d3-a456-426614174003",
	})
	@IsUUID()
	@IsOptional()
	staffId?: string;
}