import { Staff } from "./staff.interface";
import { DayOfWeek } from "./working-hours.interface";

export interface StaffSchedule {
	id: string;
	staffId: string;
	dayOfWeek: DayOfWeek;
	startTime: string; // Format: "HH:MM"
	endTime: string; // Format: "HH:MM"
	isActive: boolean;

	// Relations - optional, used for includes
	staff?: Staff;
}

export type CreateStaffScheduleParams = Omit<StaffSchedule, "id">;

export type UpdateStaffScheduleParams = Partial<
	Omit<StaffSchedule, "id" | "staffId">
>;