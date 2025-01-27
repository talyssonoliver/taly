import React from 'react';

const BookingList = () => {
    const bookings = [
        { id: 1, customer: 'John Doe', date: '2023-10-01', time: '10:00 AM' },
        { id: 2, customer: 'Jane Smith', date: '2023-10-02', time: '11:00 AM' },
        { id: 3, customer: 'Alice Johnson', date: '2023-10-03', time: '12:00 PM' },
    ];

    return (
        <div>
            <h2>Booking List</h2>
            <ul>
                {bookings.map(booking => (
                    <li key={booking.id}>
                        {booking.customer} - {booking.date} at {booking.time}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookingList;