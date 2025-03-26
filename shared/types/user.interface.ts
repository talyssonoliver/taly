import type { RefreshToken } from "./auth.interface";
import type { Company } from "./company.interface";
import type { Subscription } from "./subscription.interface";

export enum UserRole {
	ADMIN = "admin",
	COMPANY_OWNER = "company_owner",
	STAFF = "staff",
	CUSTOMER = "customer",
}

export interface StaffProfile {
	id: string;
	userId: string;
	position: string;
	bio?: string;
	specialization?: string;
	experience?: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface User {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	role: UserRole;
	isActive: boolean;
	profileImage?: string | null;
	phoneNumber?: string | null;
	createdAt: Date;
	updatedAt: Date;

	companies?: Company[];
	staffProfile?: StaffProfile;
	subscriptions?: Subscription[];
	refreshTokens?: RefreshToken[];
}

export type CreateUserParams = Omit<User, "id" | "createdAt" | "updatedAt"> & {
	password: string;
};

export type UpdateUserParams = Partial<
	Omit<User, "id" | "createdAt" | "updatedAt" | "email">
> & {
	password?: string;
};
