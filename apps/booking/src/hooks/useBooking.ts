import { useEffect, useState } from "react";

interface Booking {
	id: string;
	clientName: string;
	serviceName: string;
	dateTime: string;
	status: "confirmed" | "pending" | "canceled";
}

const useBookings = () => {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("http://localhost:3000/api/bookings")
			.then((res) => res.json())
			.then((data: Booking[]) => {
				setBookings(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Cannot Find Bookings:", error);
				setLoading(false);
			});
	}, []);

	return { bookings, loading };
};

export default useBookings;
