import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";

@ObjectType()
export class RefreshToken {
	@Field(() => ID)
	id: string;

	@Field()
	token: string;

	@Field()
	expiresAt: Date;

	@Field()
	userId: string;

	@Field(() => User)
	user: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}