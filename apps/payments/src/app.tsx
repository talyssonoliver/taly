import { useEffect, useState } from "react";
import EmptyLayout from "../layouts/EmptyLayout";
import { PaymentService } from "../services/paymentService";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  type Payment,
  PaymentSchema,
} from "../../../../shared/schemaspayment.schema";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await PaymentService.getAllPayments();
        const validatedData = z.array(PaymentSchema).parse(data);
        setPayments(validatedData);
        toast.success("Payments loaded successfully.");
      } catch (err) {
        setError("Failed to load payments.");
        toast.error("Failed to load payments.");
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

// Extracted PaymentCard component
interface PaymentCardProps {
  payment: Payment;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => (
  <li className="p-4 border rounded bg-white shadow-md">
    <p className="font-semibold">Amount: {payment.amount}</p>
    <p className="italic text-gray-600">Status: {payment.status}</p>
    <p>Payment Method: {payment.paymentMethod}</p>
    <p>Currency: {payment.currency}</p>
    <p>Created: {new Date(payment.createdAt).toLocaleDateString()}</p>
    <p>Updated: {new Date(payment.updatedAt).toLocaleDateString()}</p>
  </li>
);
