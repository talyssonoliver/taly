import { Field, ID, ObjectType } from "@nestjs/graphql";
import { NotificationType } from "./notification.entity";

@ObjectType()
export class NotificationTemplate {
	@Field(() => ID)
	id: string;

	@Field()
	key: string;

	@Field()
	type: NotificationType;

	@Field()
	subject: string;

	@Field()
	content: string;

	@Field(() => String, { nullable: true })
	variables: string[];

	@Field(() => Boolean)
	isActive: boolean;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
