import React from "react";

const PaymentHistory: React.FC = () => {
  // Sample payment history data
  const payments = [
    { id: 1, amount: 50, date: "2023-01-01", status: "Completed" },
    { id: 2, amount: 75, date: "2023-01-15", status: "Completed" },
    { id: 3, amount: 100, date: "2023-02-01", status: "Pending" },
  ];

  return (
    <div>
      <h2>Payment History</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>${payment.amount}</td>
              <td>{payment.date}</td>
              <td>{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
