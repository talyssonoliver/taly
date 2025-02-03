import type React from "react";
import { useEffect, useState } from "react";

interface Client {
	id: string;
	name: string;
}

const Dashboard: React.FC = () => {
	const [clients, setClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const response = await fetch("http://localhost:3000/api/clients");
				if (!response.ok) throw new Error("Failed to fetch clients");

				const data: Client[] = await response.json();
				setClients(data);
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchClients();
	}, []);

	if (loading) return <p>Loading clients...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div>
			<h1>Customer Dashboard</h1>
			<ul>
				{clients.map((client: Client) => (
					<li key={client.id}>{client.name}</li>
				))}
			</ul>
		</div>
	);
};

export default Dashboard;
