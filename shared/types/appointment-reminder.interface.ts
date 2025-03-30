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

export interface ReminderMetadata {
	templateId?: string;
	customMessage?: string;
	sentBy?: string;
	additionalRecipients?: string[];
	[key: string]: unknown;
}

export interface AppointmentReminder {
	id: string;
	appointmentId: string;
	type: ReminderType;
	scheduledFor: Date;
	sentAt?: Date | null;
	status: ReminderStatus;
	createdAt: Date;
	metadata: ReminderMetadata;

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
