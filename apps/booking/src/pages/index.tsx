import type React from "react";
import { BookingService } from "../services/bookingService";
import BookingCard from "../components/BookingCard";
import { useFetch } from "../../../shared-ui/src/hooks/useFetch";

const BookingPage: React.FC = () => {
  const {
    data: bookings,
    loading,
    error,
  } = useFetch(BookingService.getAllBookings);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Bookings</h1>
      {bookings && bookings.length > 0 ? (
        bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))
      ) : (
        <p>No bookings available.</p>
      )}
    </div>
  );
};

export default BookingPage;
