import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BookingCard from "./BookingCard";

const mockBooking = {
  id: "1",
  serviceName: "Service Name",
  date: "2023-10-01",
  time: "10:00 AM",
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  customerPhone: "123-456-7890",
  status: "confirmed" as "pending" | "confirmed" | "cancelled",
  notes: "Some notes",
  service: "Service Description",
  createdAt: "2023-09-01T10:00:00Z",
  updatedAt: "2023-09-15T10:00:00Z",
};

test("renders BookingCard component", () => {
  render(<BookingCard booking={mockBooking} />);
  const linkElement = screen.getByText(/Booking Details/i);
  expect(linkElement).toBeInTheDocument();
});

test("displays correct title", () => {
  const title = "Your Booking";
  render(<BookingCard booking={mockBooking} title={title} />);
  expect(screen.getByText(title)).toBeInTheDocument();
});

test("shows booking information", () => {
  const bookingInfo = "Booking Date: 2023-10-01";
  render(<BookingCard booking={mockBooking} bookingInfo={bookingInfo} />);
  expect(screen.getByText(bookingInfo)).toBeInTheDocument();
});
