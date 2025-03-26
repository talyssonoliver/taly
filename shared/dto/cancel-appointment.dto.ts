import { IsString, IsOptional, MaxLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CancelAppointmentDto {
	@ApiPropertyOptional({
		description: "Cancellation reason",
		example: "Unable to make the appointment due to illness",
		maxLength: 500,
	})
	@IsOptional()
	@IsString()
	@MaxLength(500)
	reason?: string;
}