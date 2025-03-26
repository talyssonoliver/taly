import { IsOptional, IsUUID, IsEnum, IsDateString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
	SubscriptionPlan,
	SubscriptionStatus,
} from "../types/subscription.interface";

export class UpdateSubscriptionDto {
	@ApiPropertyOptional({
		description: "Subscription plan type",
		enum: SubscriptionPlan,
		example: SubscriptionPlan.ENTERPRISE,
	})
	@IsEnum(SubscriptionPlan)
	@IsOptional()
	planType?: SubscriptionPlan;

	@ApiPropertyOptional({
		description: "Subscription status",
		enum: SubscriptionStatus,
		example: SubscriptionStatus.ACTIVE,
	})
	@IsEnum(SubscriptionStatus)
	@IsOptional()
	status?: SubscriptionStatus;

	@ApiPropertyOptional({
		description: "Subscription start date",
		example: "2023-01-01T00:00:00Z",
	})
	@IsDateString()
	@IsOptional()
	startDate?: string;

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