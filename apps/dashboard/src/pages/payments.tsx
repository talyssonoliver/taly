import { useEffect, useState } from "react";
import EmptyLayout from "../layouts/EmptyLayout";
import { paymentService } from "../services/paymentService";
import type { Payment } from "../../../../shared/interfaces/Payment";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data: Payment[] = await paymentService.findAll();
        setPayments(data);
      } catch (err) {
        setError((err as Error).message || "Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <EmptyLayout title="Payments">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      {loading ? (
        <p>Loading payments...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <ul className="space-y-4">
          {payments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </ul>
      )}
    </EmptyLayout>
  );
}

interface PaymentCardProps {
  payment: Payment;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => (
  <li className="p-4 border rounded bg-white shadow-md">
    <p className="font-semibold">ID: {payment.id}</p>
    <p>Amount: {payment.amount.toFixed(2)}</p>
    <p>Currency: {payment.currency.toUpperCase()}</p>
    <p className="italic text-gray-600">Status: {payment.status}</p>
  </li>
);
