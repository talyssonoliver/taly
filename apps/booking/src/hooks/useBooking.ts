import { useState, useEffect } from "react";
import { getBookings } from '../services/bookingService';
import { Booking } from '../../../../shared/types/booking.interface';

const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then((data: Booking[]) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((error) => {
        handleError(error);
        setLoading(false);
      });
  }, []);

  const handleError = (error: Error) => {
    console.error("Cannot find bookings:", error);
  };

  return { bookings, loading };
};

export default useBookings;
