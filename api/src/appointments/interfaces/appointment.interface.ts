import { AppointmentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Client } from "./client.interface";
import { Salon } from "./salon.interface";
import { Service } from "./service.interface";

export interface Appointment {
	id: string;
	userId: string;
	salonId: string;
	serviceId: string;
	staffId?: string;
	clientId: string;
	startTime: Date;
	endTime: Date;
	status: AppointmentStatus;
	price: Decimal | number;
	notes?: string;
	cancellationReason?: string;
	cancellationFee?: Decimal | number;
	noShowFee?: Decimal | number;
	createdAt: Date;
	updatedAt: Date;

	// Related entities
	client?: Client;
	service?: Service;
	salon?: Salon;
}

export interface AppointmentFilters {
	status?: AppointmentStatus;
	startDate?: string | Date;
	endDate?: string | Date;
	salonId?: string;
	userId?: string;
	serviceId?: string;
	staffId?: string;
	upcoming?: boolean;
}

export interface CreateAppointmentParams {
	userId: string;
	salonId: string;
	serviceId: string;
	startTime: Date;
	endTime: Date;
	staffId?: string;
	notes?: string;
	status?: AppointmentStatus;
	price: number;
}

export interface AppointmentWithRelations extends Appointment {
	user: {
		id: string;
		email: string;
		firstName: string;
		lastName?: string;
		phone?: string;
	};
	salon: {
		id: string;
		name: string;
		address?: string;
		phone?: string;
		email?: string;
	};
	service: {
		id: string;
		name: string;
		duration: number;
		price: number;
	};
}
