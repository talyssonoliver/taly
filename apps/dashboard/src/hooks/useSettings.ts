import { useEffect, useState } from "react";

interface Settings {
	theme: string;
	notificationsEnabled: boolean;
	language: string;
}

export const useSettings = () => {
	const [settings, setSettings] = useState<Settings | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const response = await fetch("http://localhost:3000/api/settings");
				if (!response.ok) {
					throw new Error("Could not fetch settings");
				}
				const data = await response.json();
				setSettings(data);
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

		fetchSettings();
	}, []);

	return { settings, loading, error };
};