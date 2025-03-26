import type { Appointment } from "./appointment.interface";
import type { ClientNote } from "./client-note.interface";
import type { Company } from "./company.interface";

export interface Client {
	id: string;
	salonId: string;
	firstName: string;
	lastName: string;
	email?: string | null;
	phoneNumber?: string | null;
	notes?: string | null;
	imageClientUrl?: string | null;
	createdAt: Date;
	updatedAt: Date;


	company?: Company;
	appointments?: Appointment[];
	clientNotes?: ClientNote[];
}

export type CreateClientParams = Omit<Client, "id" | "createdAt" | "updatedAt">;

export type UpdateClientParams = Partial<
	Omit<Client, "id" | "createdAt" | "updatedAt" | "salonId">
>;

export enum Gender {
	MALE = "MALE",
	FEMALE = "FEMALE",
	OTHER = "OTHER",
}