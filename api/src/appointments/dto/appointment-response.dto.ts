import { Field, ObjectType } from "@nestjs/graphql";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Appointment, AppointmentStatus } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { format } from "date-fns";

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

@ObjectType()
export class AppointmentResponseDto {
	@ApiProperty({ description: "Appointment ID" })
	@Field()
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
	@Field()
	startTime: Date;

	@ApiProperty({ description: "Appointment end time" })
	@Field()
	endTime: Date;

	@ApiProperty({
		description: "Appointment status",
		enum: AppointmentStatus,
	})
	@Field()
	status: AppointmentStatus;

	@ApiProperty({ description: "Appointment price" })
	@Field(() => Number, { nullable: true })
	price?: number;

	@ApiPropertyOptional({ description: "Appointment notes" })
	@Field({ nullable: true })
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

	// Improve static method to transform Prisma model to DTO
	static fromEntity(
		appointment: Appointment & {
			service?: any;
			client?: any;
			salon?: any;
			staff?: any;
		},
	): AppointmentResponseDto {
		const dto = new AppointmentResponseDto();
		dto.id = appointment.id;
		dto.userId = appointment.userId;
		dto.salonId = appointment.salonId;
		dto.serviceId = appointment.serviceId;
		dto.staffId = appointment.staffId || null;
		dto.startTime = appointment.startTime;
		dto.endTime = appointment.endTime;
		dto.status = appointment.status;
		dto.notes = appointment.notes || null;
		dto.cancellationReason = appointment.cancellationReason || null;
		dto.createdAt = appointment.createdAt;
		dto.updatedAt = appointment.updatedAt;

		// Safely convert Decimal to number for price fields
		if (appointment.price) {
			dto.price =
				typeof appointment.price === "object" && "toNumber" in appointment.price
					? appointment.price.toNumber()
					: Number(appointment.price);
		}

		if (appointment.cancellationFee) {
			dto.cancellationFee =
				typeof appointment.cancellationFee === "object" &&
				"toNumber" in appointment.cancellationFee
					? appointment.cancellationFee.toNumber()
					: Number(appointment.cancellationFee);
		}

		if (appointment.noShowFee) {
			dto.noShowFee =
				typeof appointment.noShowFee === "object" &&
				"toNumber" in appointment.noShowFee
					? appointment.noShowFee.toNumber()
					: Number(appointment.noShowFee);
		}

		// Map related entities if present
		if (appointment.service) {
			dto.service = {
				id: appointment.service.id,
				name: appointment.service.name,
				duration: appointment.service.duration,
				price:
					typeof appointment.service.price === "object" &&
					"toNumber" in appointment.service.price
						? appointment.service.price.toNumber()
						: Number(appointment.service.price),
			};
		}

		if (appointment.client) {
			dto.user = {
				id: appointment.client.id,
				fullName: appointment.client.fullName,
				email: appointment.client.email,
				phoneNumber: appointment.client.phoneNumber,
				profileImage: appointment.client.profileImage,
			};
		}

		if (appointment.salon) {
			dto.salon = {
				id: appointment.salon.id,
				name: appointment.salon.name,
				address: appointment.salon.address,
				phone: appointment.salon.phone,
				email: appointment.salon.email,
			};
		}

		return dto;
	}
}
