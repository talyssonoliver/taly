import BookingCard from './BookingCard.jsx';
import useBookings from '../hooks/useBooking.js';
import { Booking } from '../../../../shared/types/booking.interface';

const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse rounded-lg p-4 h-24" />
);

const BookingList = () => {
  const { bookings, loading } = useBookings();

  if (loading)
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map(() => {
          const uniqueId = Math.random().toString(36).substr(2, 9);
          return <SkeletonCard key={uniqueId} />;
        })}
      </div>
    );

  return (
    <div className="space-y-4">
      {bookings.map((booking: Booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};

export default BookingList;
