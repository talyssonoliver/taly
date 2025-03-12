import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "./notification.entity";
@ObjectType()
@Index(["key", "type"], { unique: true })
export class NotificationTemplate {
	@Field(() => ID)
	@ApiProperty({ description: "Template unique identifier" })
	id: string;
	@Field()
	@ApiProperty({ description: "Template unique key identifier" })
	key: string;
	@Field()
	@ApiProperty({
		description: "Type of notification this template is for",
		enum: NotificationType,
	})
	type: NotificationType;
	@Field()
	@ApiProperty({ description: "Name of the template" })
	name: string;
	@Field({ nullable: true })
	@ApiProperty({
		description: "Description of the template",
		nullable: true,
	})
	description: string | null;
	@Field()
	@ApiProperty({ description: "Subject line (for email templates)" })
	subject: string;
	@Field()
	@ApiProperty({ description: "Content of the template" })
	content: string;
	@Field()
	@ApiProperty({ description: "Whether this template is active" })
	isActive: boolean;
	@Field()
	@ApiProperty({
		description: "Default variables",
		nullable: true,
	})
	defaultVariables: Record<string, any> | null;
	@Field()
	@ApiProperty({ description: "When the template was created" })
	createdAt: Date;
	@Field()
	@ApiProperty({ description: "When the template was last updated" })
	updatedAt: Date;
}


