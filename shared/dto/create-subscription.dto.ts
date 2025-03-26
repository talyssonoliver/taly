import {
	IsNotEmpty,
	IsOptional,
	IsUUID,
	IsEnum,
	IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	SubscriptionPlan,
	SubscriptionStatus,
} from "../types/subscription.interface";

export class CreateSubscriptionDto {
	@ApiProperty({
		description: "User ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "User ID is required" })
	userId: string;

	@ApiProperty({
		description: "Subscription plan type",
		enum: SubscriptionPlan,
		example: SubscriptionPlan.PROFESSIONAL,
	})
	@IsEnum(SubscriptionPlan)
	@IsNotEmpty({ message: "Plan type is required" })
	planType: SubscriptionPlan;

	@ApiProperty({
		description: "Subscription status",
		enum: SubscriptionStatus,
		example: SubscriptionStatus.ACTIVE,
	})
	@IsEnum(SubscriptionStatus)
	@IsNotEmpty({ message: "Status is required" })
	status: SubscriptionStatus;

	@ApiProperty({
		description: "Subscription start date",
		example: "2023-01-01T00:00:00Z",
	})
	@IsDateString()
	@IsNotEmpty({ message: "Start date is required" })
	startDate: string;

	@ApiPropertyOptional({
		description: "Subscription end date",
		example: "2023-12-31T23:59:59Z",
	})
	@IsDateString()
	@IsOptional()
	endDate?: string;

	@ApiPropertyOptional({
		description: "Salon ID to associate with subscription",
		example: "123e4567-e89b-12d3-a456-426614174001",
	})
	@IsUUID()
	@IsOptional()
	salonId?: string;
}