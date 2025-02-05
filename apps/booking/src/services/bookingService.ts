import axios from "axios";
import type { Booking } from "../../../../shared/types/booking.interface";

const API_URL = "http://localhost:3000/api/bookings";

export const BookingService = {
	getAllBookings: async (): Promise<Booking[]> => {
		const response = await axios.get<Booking[]>(API_URL);
		return response.data;
	},

	getBookingById: async (id: string): Promise<Booking> => {
		const response = await axios.get<Booking>(`${API_URL}/${id}`);
		return response.data;
	},

	createBooking: async (booking: Omit<Booking, "id">): Promise<Booking> => {
		const response = await axios.post<Booking>(API_URL, booking);
		return response.data;
	},

	updateBooking: async (
		id: string,
		updatedData: Partial<Booking>,
	): Promise<Booking> => {
		const response = await axios.patch<Booking>(
			`${API_URL}/${id}`,
			updatedData,
		);
		return response.data;
	},

	cancelBooking: async (id: string): Promise<void> => {
		await axios.delete(`${API_URL}/${id}`);
	},
};
