import { Company } from "./company.interface";
import { Client } from "./client.interface";
import { Service } from "./service.interface";
import { Staff } from "./staff.interface";
import { Payment } from "./payment.interface";
import type { AppointmentReminder } from "./appointment-reminder.interface";

export enum AppointmentStatus {
	SCHEDULED = "scheduled",
	CONFIRMED = "confirmed",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
	NO_SHOW = "no_show",
	RESCHEDULED = "rescheduled",
	PENDING = "pending",
}

export interface Appointment {
	id: string;
	salonId: string;
	clientId: string;
	staffId?: string | null;
	serviceId: string;
	startTime: Date;
	endTime: Date;
	status: AppointmentStatus;
	notes?: string | null;
	createdAt: Date;
	updatedAt: Date;

	// Relations - optional, used for includes
	company?: Company;
	client?: Client;
	service?: Service;
	staff?: Staff | null;
	payment?: Payment | null;
	reminders?: AppointmentReminder[];
}

export type CreateAppointmentParams = Omit<
	Appointment,
	"id" | "createdAt" | "updatedAt"
>;

export type UpdateAppointmentParams = Partial<
	Omit<
		Appointment,
		"id" | "createdAt" | "updatedAt" | "salonId" | "clientId" | "serviceId"
	>
>;

export type RescheduleAppointmentParams = {
	startTime: Date;
	endTime: Date;
	staffId?: string;
};

export type CancelAppointmentParams = {
	reason?: string;
};