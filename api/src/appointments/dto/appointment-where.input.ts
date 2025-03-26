import { Field, InputType } from "@nestjs/graphql";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional, IsUUID } from "class-validator";
import { AppointmentStatus } from "../../common/enums/appointment-status.enum";

@InputType()
export class AppointmentWhereInput {
	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Filter by the user who created the appointment",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsOptional()
	@IsUUID()
	userId?: string;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Filter by salon ID",
		example: "123e4567-e89b-12d3-a456-426614174001",
	})
	@IsOptional()
	@IsUUID()
	salonId?: string;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Filter by client ID",
		example: "123e4567-e89b-12d3-a456-426614174002",
	})
	@IsOptional()
	@IsUUID()
	clientId?: string;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Filter by service ID",
		example: "123e4567-e89b-12d3-a456-426614174003",
	})
	@IsOptional()
	@IsUUID()
	serviceId?: string;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Filter by staff ID",
		example: "123e4567-e89b-12d3-a456-426614174004",
	})
	@IsOptional()
	@IsUUID()
	staffId?: string;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Filter by appointment status",
		enum: AppointmentStatus,
		example: AppointmentStatus.SCHEDULED,
	})
	@IsOptional()
	@IsEnum(AppointmentStatus)
	status?: AppointmentStatus;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Filter by appointments starting after this date",
		example: "2023-05-15T00:00:00Z",
	})
	@IsOptional()
	@IsDateString()
	startDate?: string;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Filter by appointments starting before this date",
		example: "2023-05-16T00:00:00Z",
	})
	@IsOptional()
	@IsDateString()
	endDate?: string;

	@Field({ nullable: true })
	@ApiPropertyOptional({
		description: "Filter to only include upcoming appointments",
		example: true,
	})
	@IsOptional()
	upcoming?: boolean;
}
