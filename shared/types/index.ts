export * from "./appointment.interface";
export * from "./appointment-reminder.interface";
export * from "./auth.interface";
export * from "./client.interface";
export * from "./client-note.interface";
export * from "./payment.interface";
export * from "./refund.interface";
export * from "./company.interface";
export * from "./service.interface";
export * from "./staff.interface";
export * from "./staff-schedule.interface";
export * from "./subscription.interface";
export * from "./user.interface";
export * from "./website.interface";
export * from "./working-hours.interface";


export interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

export interface PaginatedResult<T> {
	data: T[];
	meta: PaginationMeta;
}

export interface ResponseMessage<T> {
	statusCode: number;
	message: string;
	data: T;
	timestamp: string;
}