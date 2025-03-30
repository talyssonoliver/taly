export interface Booking {
	id: string;
	serviceName: string;
	date: string;
	time: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	status: "pending" | "confirmed" | "cancelled";
	notes: string;
	service: string;
	createdAt: string;
	updatedAt: string;
}
