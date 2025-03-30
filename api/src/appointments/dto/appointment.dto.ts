import {
	Field,
	Float,
	GraphQLISODateTime,
	ID,
	ObjectType,
} from "@nestjs/graphql";
import { AppointmentStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
	IsDate,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";
import { ClientDto } from "../../clients/dto/client.dto";
import { SalonDto } from "../../salons/dto/salon.dto";
import { ServiceDto } from "../../services/dto/service.dto";
import { StaffDto } from "../../staff/dto/staff.dto";

@ObjectType()
export class AppointmentDto {
	@Field(() => ID)
	@IsUUID()
	id: string;

	@Field(() => GraphQLISODateTime)
	@IsDate()
	startTime: Date;

	@Field(() => GraphQLISODateTime)
	@IsDate()
	endTime: Date;

	@Field(() => String)
	@IsEnum(AppointmentStatus)
	status: AppointmentStatus;

	@Field(() => Float)
	@IsNumber()
	price: number; // Note: This is a number in DTO but Prisma.Decimal in the database

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	notes?: string;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	cancellationReason?: string;

	@Field(() => Float, { nullable: true })
	@IsNumber()
	@IsOptional()
	cancellationFee?: number; // Note: This is a number in DTO but Prisma.Decimal in the database

	@Field(() => Float, { nullable: true })
	@IsNumber()
	@IsOptional()
	noShowFee?: number; 

	@Field(() => String)
	@IsUUID()
	userId: string;

	@Field(() => String)
	@IsUUID()
	salonId: string;

	@Field(() => String)
	@IsUUID()
	serviceId: string;

	@Field(() => String, { nullable: true })
	@IsUUID()
	@IsOptional()
	staffId?: string;

	@Field(() => String, { nullable: true })
	@IsUUID()
	@IsOptional()
	clientId?: string;

	@Field(() => ServiceDto, { nullable: true })
	@Type(() => ServiceDto)
	service?: ServiceDto;

	@Field(() => ClientDto, { nullable: true })
	@Type(() => ClientDto)
	client?: ClientDto;

	@Field(() => SalonDto, { nullable: true })
	@Type(() => SalonDto)
	salon?: SalonDto;

	@Field(() => StaffDto, { nullable: true })
	@Type(() => StaffDto)
	staff?: StaffDto;

	@Field(() => GraphQLISODateTime)
	createdAt: Date;

	@Field(() => GraphQLISODateTime)
	updatedAt: Date;
}
