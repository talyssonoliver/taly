import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { format } from "date-fns";
import { AppointmentStatus } from "../../common/enums/appointment-status.enum";

class UserDto {
	@ApiProperty({ description: "User ID" })
	id: string;

	@ApiProperty({ description: "User full name" })
	fullName: string;

	@ApiProperty({ description: "User email" })
	email: string;

	@ApiPropertyOptional({ description: "User phone number" })
	phoneNumber?: string;

	@ApiPropertyOptional({ description: "User profile image" })
	profileImage?: string;
}

class SalonDto {
	@ApiProperty({ description: "Salon ID" })
	id: string;

	@ApiProperty({ description: "Salon name" })
	name: string;

	@ApiPropertyOptional({ description: "Salon address" })
	address?: string;

	@ApiPropertyOptional({ description: "Salon phone number" })
	phone?: string;

	@ApiPropertyOptional({ description: "Salon email" })
	email?: string;
}

class ServiceDto {
	@ApiProperty({ description: "Service ID" })
	id: string;

	@ApiProperty({ description: "Service name" })
	name: string;

	@ApiProperty({ description: "Service duration in minutes" })
	duration: number;

	@ApiProperty({ description: "Service price" })
	price: number;
}

export class AppointmentResponseDto {
	@ApiProperty({ description: "Appointment ID" })
	id: string;

	@ApiProperty({ description: "User ID" })
	userId: string;

	@ApiProperty({ description: "Salon ID" })
	salonId: string;

	@ApiProperty({ description: "Service ID" })
	serviceId: string;

	@ApiPropertyOptional({ description: "Staff member ID" })
	staffId?: string;

	@ApiProperty({ description: "Appointment start time" })
	startTime: Date;

	@ApiProperty({ description: "Appointment end time" })
	endTime: Date;

	@ApiProperty({
		description: "Appointment status",
		enum: AppointmentStatus,
	})
	status: AppointmentStatus;

	@ApiProperty({ description: "Appointment price" })
	price: number;

	@ApiPropertyOptional({ description: "Appointment notes" })
	notes?: string;

	@ApiPropertyOptional({ description: "Cancellation reason" })
	cancellationReason?: string;

	@ApiPropertyOptional({ description: "Cancellation fee" })
	cancellationFee?: number;

	@ApiPropertyOptional({ description: "No-show fee" })
	noShowFee?: number;

	@ApiProperty({ description: "Appointment creation date" })
	createdAt: Date;

	@ApiProperty({ description: "Appointment last update date" })
	updatedAt: Date;

	@ApiProperty({ description: "User information" })
	@Type(() => UserDto)
	user: UserDto;

	@ApiProperty({ description: "Salon information" })
	@Type(() => SalonDto)
	salon: SalonDto;

	@ApiProperty({ description: "Service information" })
	@Type(() => ServiceDto)
	service: ServiceDto;

	@ApiPropertyOptional({ description: "Staff member information" })
	@Type(() => UserDto)
	staff?: UserDto;

	@ApiProperty({ description: "Formatted start time" })
	@Expose()
	get formattedStartTime(): string {
		return format(new Date(this.startTime), "MMM dd, yyyy h:mm a");
	}

	@ApiProperty({ description: "Formatted end time" })
	@Expose()
	get formattedEndTime(): string {
		return format(new Date(this.endTime), "MMM dd, yyyy h:mm a");
	}
}
