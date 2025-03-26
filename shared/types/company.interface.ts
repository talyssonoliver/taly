import type { Appointment, Client, Service, Staff, Subscription, Website, WorkingHours } from ".";
import type { User } from "./user.interface";

export interface Company {
	id: string;
	ownerId: string;
	name: string;
	description?: string | null;
	logoUrl?: string | null;
	address?: string | null;
	postCode?: string | null;
	phoneNumber?: string | null;
	email: string;
	websiteSlug?: string | null;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;

	// Relations - optional, used for includes
	owner?: User;
	services?: Service[];
	appointments?: Appointment[];
	staff?: Staff[];
	clients?: Client[];
	workingHours?: WorkingHours[];
	subscription?: Subscription | null;
	website?: Website | null;
}

export type CreateSalonParams = Omit<Company, "id" | "createdAt" | "updatedAt">;

export type UpdateSalonParams = Partial<
	Omit<Company, "id" | "createdAt" | "updatedAt" | "ownerId">
>;
