import { Client } from "./client.interface";

export enum NoteType {
	GENERAL = "GENERAL",
	APPOINTMENT = "APPOINTMENT",
	MEDICAL = "MEDICAL",
	PREFERENCE = "PREFERENCE",
	FEEDBACK = "FEEDBACK",
}

export interface ClientNote {
	id: string;
	clientId: string;
	note: string;
	createdAt: Date;
	createdBy: string;

	// Relations - optional, used for includes
	client?: Client;
}

export type CreateClientNoteParams = Omit<ClientNote, "id" | "createdAt">;

export type UpdateClientNoteParams = Partial<
	Omit<ClientNote, "id" | "createdAt" | "clientId" | "createdBy">
>;