import { User } from "./user.interface";
import { Service } from "./service.interface";
import type { Company } from "./company.interface";
import type { Appointment } from "./appointment.interface";
import type { StaffSchedule } from "./staff-schedule.interface";

export interface Staff {
	id: string;
	userId: string;
	salonId: string;
	bio?: string | null;
	position?: string | null;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;

	user?: User;
	company?: Company;
	appointments?: Appointment[];
	schedule?: StaffSchedule[];
	services?: Service[];
}

export type CreateStaffParams = Omit<Staff, "id" | "createdAt" | "updatedAt">;

export type UpdateStaffParams = Partial<
	Omit<Staff, "id" | "createdAt" | "updatedAt" | "userId" | "salonId">
>;