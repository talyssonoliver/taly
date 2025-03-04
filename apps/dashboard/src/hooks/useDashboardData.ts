import { useEffect, useState } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
}

export const useDashboardData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/clients");
        if (!response.ok) {
          throw new Error("Customer not found");
        }
        const data = await response.json();
        setClients(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading, error };
};
