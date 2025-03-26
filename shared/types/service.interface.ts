import type { Appointment } from "./appointment.interface";
import type { Company } from "./company.interface";
import type { Staff } from "./staff.interface";


export interface Service {
	id: string;
	salonId: string;
	staffId?: string | null;
	name: string;
	description?: string | null;
	duration: number; // in minutes
	price: number;
	discount?: number | null;
	isActive: boolean;
	available: boolean;
	imageServiceUrl?: string | null;
	createdAt: Date;
	updatedAt: Date;

	// Relations - optional, used for includes
	company?: Company;
	appointments?: Appointment[];
	staff?: Staff | null;
}

export type CreateServiceParams = Omit<
	Service,
	"id" | "createdAt" | "updatedAt"
>;

export type UpdateServiceParams = Partial<
	Omit<Service, "id" | "createdAt" | "updatedAt" | "salonId">
>;