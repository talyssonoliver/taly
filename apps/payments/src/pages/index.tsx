import type React from "react";
import { useEffect, useState } from "react";
import TransactionCard from "../components/TransactionCard";
import { PaymentService } from "../services/paymentService";

interface Payment {
  id: string;
  amount: number;
  status: string;
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPayments = async () => {
      try {
        const data = await PaymentService.getAllPayments();
        if (isMounted) setPayments(data);
      } catch (err) {
        if (isMounted) setError("Error fetching payments");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPayments();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Payments</h1>
      {payments.length > 0 ? (
        payments.map((payment) => (
          <TransactionCard key={payment.id} transaction={payment} />
        ))
      ) : (
        <p>No payments available.</p>
      )}
    </div>
  );
};

export default PaymentsPage;
