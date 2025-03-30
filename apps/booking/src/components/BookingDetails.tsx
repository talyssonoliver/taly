import type React from "react";
import type { Booking } from "../../../../shared/types/booking.interface";
import { formatDate } from "../../../../shared/utils/date-helper";

interface BookingDetailsProps {
	booking: Booking;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => {
	if (!booking) return null;

	return (
		<div className="p-4 border rounded-lg shadow-md">
			<h2 className="text-xl font-bold mb-2">Booking Details</h2>
			<p>
				<strong>Service:</strong> {booking.serviceName}
			</p>
			<p>
				<strong>Date:</strong> {formatDate(new Date(booking.date))}
			</p>
			<p>
				<strong>Time:</strong> {booking.time}
			</p>
			<p>
				<strong>Customer:</strong> {booking.customerName}
			</p>
			<p>
				<strong>Status:</strong>{" "}
				<span className={`status-${booking.status.toLowerCase()}`}>
					{booking.status}
				</span>
			</p>
			<div className="booking-info">
				<p>ID: {booking.id}</p>
				{/* Add more booking information as needed */}
			</div>
		</div>
	);
};
