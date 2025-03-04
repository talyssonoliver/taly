import { useEffect, useState } from "react";
import { useRouter } from "next/router.js";
import { BookingDetails } from "../components/BookingDetails.js";
import { BookingService } from "../services/bookingService.js";
import PublicLayout from "../layouts/PublicLayout.js";
import Spinner from "../../../shared-ui/src/components/Spinner.js";
import ErrorMessage from "../../../shared-ui/src/components/ErrorMessage.tsx";
import type { Booking } from "shared/types/Booking.interface.js";

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
