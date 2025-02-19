import React from "react";

const BookingDetails: React.FC = () => {
  // Sample booking details data
  const booking = {
    id: "12345",
    customerName: "John Doe",
    service: "Haircut",
    date: "2023-10-15",
    time: "14:00",
    status: "Confirmed",
  };

  return (
    <div>
      <h1>Booking Details</h1>
      <p>
        <strong>Booking ID:</strong> {booking.id}
      </p>
      <p>
        <strong>Customer Name:</strong> {booking.customerName}
      </p>
      <p>
        <strong>Service:</strong> {booking.service}
      </p>
      <p>
        <strong>Date:</strong> {booking.date}
      </p>
      <p>
        <strong>Time:</strong> {booking.time}
      </p>
      <p>
        <strong>Status:</strong> {booking.status}
      </p>
    </div>
  );
};

export default BookingDetails;
