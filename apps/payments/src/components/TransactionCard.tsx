import type React from "react";
import type { Payment } from "../services/paymentService";

export interface TransactionCardProps {
  payment: Payment;
}

const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-yellow-500 text-white",
  completed: "bg-green-500 text-white",
  failed: "bg-red-500 text-white",
};

const TransactionCard: React.FC<TransactionCardProps> = ({ payment }) => {
  const { id, amount, status, date, paymentMethod } = payment;

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Transaction #{id}</h3>
        <span className={`px-2 py-1 rounded ${STATUS_CLASSES[status]}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <p>
        Amount: <strong>${amount.toFixed(2)}</strong>
      </p>
      <p>Date: {new Date(date).toLocaleDateString()}</p>
      <p>Method: {paymentMethod.replace("_", " ")}</p>
    </div>
  );
};

export default TransactionCard;
