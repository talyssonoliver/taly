import axios from "axios";
import type { Booking } from "../../../../shared/types/booking.interface";

const API_URL = "http://localhost:3000/api/bookings";

// Add this function to match the import used by useBooking.tsngs function to match the import in useBooking.ts
export const getBookings = async (): Promise<Booking[]> => {g[]> => {
  return BookingService.getAllBookings();
};

export const BookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await axios.get<Booking[]>(API_URL);
    return response.data;t axios.get<Booking[]>(API_URL);
  },return response.data;
  },
  getBookingById: async (id: string): Promise<Booking> => {
    const response = await axios.get<Booking>(`${API_URL}/${id}`);
    return response.data;t axios.get<Booking>(`${API_URL}/${id}`);
  },return response.data;
  },
  createBooking: async (booking: Omit<Booking, "id">): Promise<Booking> => {
    const response = await axios.post<Booking>(API_URL, booking);: async (booking: Omit<Booking, "id">): Promise<Booking> => {
    return response.data;post<Booking>(API_URL, booking);
  },

  updateBooking: async (
    id: string,async (
    updatedData: Partial<Booking>: string,
  ): Promise<Booking> => {Booking>
    const response = await axios.patch<Booking>( Promise<Booking> => {
      `${API_URL}/${id}`,    const response = await axios.patch<Booking>(
      updatedData
    );
    return response.data;);
  },  return response.data;
  },





};  },    await axios.delete(`${API_URL}/${id}`);  cancelBooking: async (id: string): Promise<void> => {
  cancelBooking: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
