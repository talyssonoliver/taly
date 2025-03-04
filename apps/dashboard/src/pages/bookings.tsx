import { useEffect, useState } from "react";
import EmptyLayout from "../layouts/EmptyLayout";
import { bookingService } from "../services/bookingService";

interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getAllBookings();
        setBookings(data);
      } catch (err) {
        setError((err as Error).message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <EmptyLayout title="Bookings">
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </ul>
      )}
    </EmptyLayout>
  );
}

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => (
  <li className="p-4 border rounded">
    <p className="font-semibold">{booking.customerName}</p>
    <p>{booking.serviceName}</p>
    <p>
      {new Date(booking.date).toLocaleDateString()} at {booking.time}
    </p>
    <p className="italic text-gray-600">Status: {booking.status}</p>
  </li>
);
