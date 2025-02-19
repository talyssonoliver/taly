import { useState, useEffect } from "react";
import { BookingService } from "../services/bookingService";
import type { Booking } from "../../../../shared/types/booking.interface";

const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BookingService.getAllBookings()
      .then((data: Booking[]) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Cannot find bookings:", error);
        setLoading(false);
      });
  }, []);

  return { bookings, loading };
};

export default useBookings;
