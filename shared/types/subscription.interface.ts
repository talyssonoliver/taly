import type { Company } from "./company.interface";
import { User } from "./user.interface";

export enum SubscriptionPlan {
	FREE = "free",
	BASIC = "basic",
	PROFESSIONAL = "professional",
	ENTERPRISE = "enterprise",
}

export enum SubscriptionStatus {
	ACTIVE = "active",
	EXPIRED = "expired",
	CANCELLED = "cancelled",
	PENDING = "pending",
	TRIAL = "trial",
}

export interface Subscription {
	id: string;
	userId: string;
	planType: SubscriptionPlan;
	status: SubscriptionStatus;
	startDate: Date;
	endDate?: Date | null;
	createdAt: Date;
	updatedAt: Date;

	// Relations - optional, used for includes
	user?: User;
	companyId?: string | null;
	company?: Company | null;
}

export type CreateSubscriptionParams = Omit<
	Subscription,
	"id" | "createdAt" | "updatedAt"
>;

export type UpdateSubscriptionParams = Partial<
	Omit<Subscription, "id" | "createdAt" | "updatedAt" | "userId">
>;
