import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <h2>Dashboard Navigation</h2>
            <ul>
                <li>
                    <Link to="/dashboard/home">Home</Link>
                </li>
                <li>
                    <Link to="/dashboard/reports">Reports</Link>
                </li>
                <li>
                    <Link to="/dashboard/bookings">Bookings</Link>
                </li>
                <li>
                    <Link to="/dashboard/payments">Payments</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;