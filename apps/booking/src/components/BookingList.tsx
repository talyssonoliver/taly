import React from "react";
import BookingCard from "./BookingCard";
import useBookings from "hooks/useBooking";

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
			{bookings.map((booking) => (
				<BookingCard key={booking.id} {...booking} />
			))}
		</div>
	);
};

export default BookingList;