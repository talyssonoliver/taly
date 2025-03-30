import PublicLayout from "@/layouts/PublicLayout";
import { BookingDetails } from "@components/BookingDetails";
import { BookingService } from "@services/bookingService";
import { ErrorMessage, Spinner } from "@shared-ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Booking } from "shared/types/Booking.interface";

const BookingPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const [booking, setBooking] = useState<Booking | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		const fetchBooking = async () => {
			try {
				setLoading(true);
				const data = await BookingService.getBookingById(id as string);
				setBooking(data);
			} catch (err) {
				setError("Failed to load booking details. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchBooking();
	}, [id]);

	if (loading) return <Spinner />;
	if (error) return <ErrorMessage message={error} />;
	if (!booking) return <ErrorMessage message="Booking not found." />;

	return (
		<PublicLayout>
			<BookingDetails booking={booking} />
		</PublicLayout>
	);
};

export default BookingPage;
