export interface TimeSlotWhereInput {
	id?: string | { equals?: string; not?: string | { equals?: string } };
	salonId?: string | { equals?: string };
	staffId?: string | { equals?: string };
	startTime?: Date | { gte?: Date; lt?: Date; lte?: Date };
	endTime?: Date | { gt?: Date; gte?: Date; lte?: Date };
	isAvailable?: boolean;
	OR?: Record<string, unknown>[];
}

export interface TimeSlotOrderByInput {
	startTime?: "asc" | "desc";
	endTime?: "asc" | "desc";
	createdAt?: "asc" | "desc";
	updatedAt?: "asc" | "desc";
}

export interface TimeSlotUpdateInput {
	startTime?: Date;
	endTime?: Date;
	staffId?: string;
	isAvailable?: boolean;
	notes?: string;
	salonId?: string;
}
