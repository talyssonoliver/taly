import { Appointment } from "./appointment.interface";

export enum ReminderType {
	EMAIL = "EMAIL",
	SMS = "SMS",
	PUSH = "PUSH",
}

export enum ReminderStatus {
	PENDING = "pending",
	SENT = "sent",
	FAILED = "failed",
}

export interface AppointmentReminder {
	id: string;
	appointmentId: string;
	type: ReminderType;
	sentAt?: Date | null;
	status: ReminderStatus;
	createdAt: Date;

	// Relations - optional, used for includes
	appointment?: Appointment;
}

export type CreateAppointmentReminderParams = Omit<
	AppointmentReminder,
	"id" | "createdAt"
>;

export type UpdateAppointmentReminderParams = Partial<
	Omit<AppointmentReminder, "id" | "createdAt" | "appointmentId">
>;