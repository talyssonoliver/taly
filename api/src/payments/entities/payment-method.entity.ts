import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { PaymentProvider } from "./payment.entity";

export enum PaymentMethodType {
	CARD = "CARD",
	BANK_ACCOUNT = "BANK_ACCOUNT",
	PAYPAL = "PAYPAL",
}

@ObjectType()
export class PaymentMethod {
	@Field(() => ID)
	id: string;

	@Field()
	userId: string;

	@Field()
	type: PaymentMethodType;

	@Field()
	provider: PaymentProvider;

	@Field()
	token: string;

	@Field()
	isDefault: boolean;

	@Field({ nullable: true })
	lastFour: string;

	@Field({ nullable: true })
	expiryMonth: string;

	@Field({ nullable: true })
	expiryYear: string;

	@Field({ nullable: true })
	cardBrand: string;

	@Field(() => User)
	user: User;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}
