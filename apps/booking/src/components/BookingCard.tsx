import React from 'react';
import styles from './BookingCard.module.css';

export interface BookingCardProps {
  booking: {
    id: string;
    serviceName: string;
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: string;
    notes: string;
    service: string;
    createdAt: string;
    updatedAt: string;
  };
  title?: string;
  bookingInfo?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, title, bookingInfo }) => {
  return (
    <div className={styles.card}>
      {title && <h3>{title}</h3>}
      <div className={styles.cardHeader}>
        <h3>{booking.serviceName}</h3>
        <span className={styles.status}>{booking.status}</span>
      </div>
      <div className={styles.cardBody}>
        <p><strong>Date:</strong> {booking.date}</p>
        <p><strong>Time:</strong> {booking.time}</p>
        <p><strong>Customer:</strong> {booking.customerName}</p>
        <p><strong>Email:</strong> {booking.customerEmail}</p>
        <p><strong>Phone:</strong> {booking.customerPhone}</p>
        {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
        {bookingInfo && <p>{bookingInfo}</p>}
      </div>
    </div>
  );
};

export default BookingCard;
