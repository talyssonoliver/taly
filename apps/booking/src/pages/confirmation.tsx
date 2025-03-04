import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PublicLayout from "../layouts/PublicLayout";
import Spinner from "../../../shared-ui/src/components/Spinner";
import ErrorMessage from "../../../shared-ui/src/components/ErrorMessage";
import { BookingDetails } from "../components/BookingDetails";
import { BookingService } from "../services/bookingService";
import type { Booking } from "shared/types/Booking.interface";

const ConfirmationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Booking ID is missing.");
      setLoading(false);
      return;
    }

    const fetchBookingConfirmation = async () => {
      try {
        setLoading(true);
        const data = await BookingService.getBookingById(id as string);
        setBooking(data);
      } catch (err) {
        setError(
          "Failed to load booking confirmation. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookingConfirmation();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!booking)
    return <ErrorMessage message="Booking confirmation not found." />;

  return (
    <PublicLayout title="Booking Confirmation">
      <div>
        <h1>Booking Confirmed!</h1>
        <p>Thank you for your booking. Here are your booking details:</p>
        <BookingDetails booking={booking} />{" "}
      </div>
    </PublicLayout>
  );
};

export default ConfirmationPage;
