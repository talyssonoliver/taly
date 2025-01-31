import React, { useEffect, useState } from "react";
import type { PrismaClient } from "@prisma/client";

const Dashboard = () => {
	const [clients, setClients] = useState<PrismaClient[]>([]);

	useEffect(() => {
		fetch("http://localhost:3000/api/clients")
			.then((res) => res.json())
			.then((data) => setClients(data));
	}, []);

	return (
		<div>
			<h1>Customer Dashboard</h1>
			<ul>
				{clients.map((client) => (
					<li key={client.id}>{client.name}</li>
				))}
			</ul>
		</div>
	);
};

export default Dashboard;
