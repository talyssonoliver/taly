import type React from "react";
import type { Booking } from "apps/booking/src/services/bookingService";

export interface BookingCardProps {
	booking: Booking;
	children?: React.ReactNode;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, children }) => {
	let statusClass = "";

	switch (booking.status.toLowerCase()) {
		case "confirmed":
			statusClass = "bg-green-500";
			break;
		case "pending":
			statusClass = "bg-yellow-500";
			break;
		case "canceled":
			statusClass = "bg-red-500";
			break;
		default:
			break;
	}

	return (
		<div className="booking-card p-4 border rounded shadow">
			<h2 className="text-xl font-bold">{booking.customerName}</h2>
			<p className="text-gray-700">{booking.service}</p>
			<p className="text-gray-500">{new Date(booking.date).toLocaleString()}</p>
			<p className={`status ${statusClass} text-white p-2 rounded`}>
				{booking.status.toUpperCase()}
			</p>
			{children}
		</div>
	);
};

export default BookingCard;
