// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { useState } from 'react';


const BookingForm = () => {
    const [customerName, setCustomerName] = useState('');
    const [service, setService] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    interface BookingFormData {
        customerName: string;
        service: string;
        date: string;
        time: string;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const bookingData: BookingFormData = { customerName, service, date, time };
        console.log('Booking submitted:', bookingData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="customerName">Customer Name:</label>
                <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="service">Service:</label>
                <input
                    type="text"
                    id="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="time">Time:</label>
                <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Book Appointment</button>
        </form>
    );
};

export default BookingForm;