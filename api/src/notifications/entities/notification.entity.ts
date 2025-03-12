import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ApiProperty } from "@nestjs/swagger";
export enum NotificationType {
	EMAIL = "email",
	SMS = "sms",
	PUSH = "push",
	IN_APP = "in_app",
}
export enum NotificationStatus {
	PENDING = "pending",
	SENT = "sent",
	DELIVERED = "delivered",
	READ = "read",
	FAILED = "failed",
}
@ObjectType()
@Index(["userId", "status"])
@Index(["type", "status"])
export class Notification {
	@Field(() => ID)
	@ApiProperty({ description: "Notification unique identifier" })
	id: string;
	@Field()
	@ApiProperty({
		description: "ID of the user who should receive the notification",
	})
	userId: string;
	@Field()
	@ApiProperty({
		description: "Type of notification",
		enum: NotificationType,
	})
	type: NotificationType;
	@Field()
	@ApiProperty({
		description: "Template identifier used for this notification",
	})
	templateKey: string;
	@Field()
	@ApiProperty({ description: "Content of the notification (may be JSON)" })
	content: string;
	@Field()
	@ApiProperty({
		description: "Current status of the notification",
		enum: NotificationStatus,
	})
	status: NotificationStatus;
	@Field()
	@ApiProperty({
		description: "When the notification was sent",
		nullable: true,
	})
	sentAt: Date | null;
	@Field()
	@ApiProperty({
		description: "When the notification was delivered",
		nullable: true,
	})
	deliveredAt: Date | null;
	@Field()
	@ApiProperty({
		description: "When the notification was read by the user",
		nullable: true,
	})
	readAt: Date | null;
	@Field({ nullable: true })
	@ApiProperty({
		description: "Error message if sending failed",
		nullable: true,
	})
	error: string | null;
	@Field()
	@ApiProperty({
		description: "Additional metadata",
		nullable: true,
	})
	metadata: Record<string, any> | null;
	@Field()
	@ApiProperty({ description: "When the notification was created" })
	createdAt: Date;
	@Field()
	@ApiProperty({ description: "When the notification was last updated" })
	updatedAt: Date;
}


