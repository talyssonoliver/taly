import type { Company } from "./company.interface";

export enum DayOfWeek {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 0,
}

export interface WorkingHours {
	id: string;
	companyId: string;
	dayOfWeek: DayOfWeek;
	openTime: string; // Format: "HH:MM"
	closeTime: string; // Format: "HH:MM"
	isClosed: boolean;

	// Relations - optional, used for includes
	company?: Company;
}

export type CreateWorkingHoursParams = Omit<WorkingHours, "id">;

export type UpdateWorkingHoursParams = Partial<
	Omit<WorkingHours, "id" | "salonId">
>;