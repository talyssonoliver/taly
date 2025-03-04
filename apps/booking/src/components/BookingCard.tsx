import type React from "react";
import type { Booking } from "../../../../shared/types/booking.interface";

export interface BookingCardProps {
  booking: Booking;
}

const STATUS_CLASSES: Record<string, string> = {
  confirmed: "bg-green-500 text-white",
  pending: "bg-yellow-500 text-white",
  canceled: "bg-red-500 text-white",
};

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const { customerName, service, date, status } = booking;

  return (
    <article className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-lg font-semibold">{customerName}</h3>
        <p className="text-gray-600">{service}</p>
        <p className="text-gray-500">{new Date(date).toLocaleString()}</p>
      </div>
      <span
        className={`px-3 py-1 text-sm font-medium rounded ${STATUS_CLASSES[status]}`}
      >
        {status.toUpperCase()}
      </span>
    </article>
  );
};

export default BookingCard;
